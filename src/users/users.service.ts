import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { User } from './entities/user.entity';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {

    if(roles.length === 0) 
      return this.userRepository.find({
        //* No es necesario porque tenemos lazy la propiedad lastUpdateBy
        // relations: {
        //   lastUpdateBy: true // Le permite saber a GraphQL que debe cargar la relacion
        // }
      });

    //* Tenemos roles

    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]') // filtrar los usuarios según los roles que coincidan
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${email} not found`
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `${id} not found`
      });
    }
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    updateBy: User
    ): Promise<User> {
    try {
      const user = await this.userRepository.preload({ 
        ...updateUserInput,
        id
      });
      
      user.lastUpdateBy = updateBy;

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  /**
   * Bloquear a un usuario por ID, es equivalente al eliminar, solo que en este caso lo desactivamos para mantener la integridad referencial de la base de datos
   * @param id ID del usuario a bloquear
   */
  async block(id: string, admin: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;

    userToBlock.lastUpdateBy = admin;

    return await this.userRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error - check server logs');
  }
}
