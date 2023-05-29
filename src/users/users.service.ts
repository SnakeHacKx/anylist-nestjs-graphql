import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { User } from './entities/user.entity';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async findAll(): Promise<User[]> {
    return [];
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

  update(id: string, updateUserInput: UpdateUserInput) {
    throw new Error('FindOne not implemented');
  }

  block(id: string): Promise<User> {
    throw new Error('FindOne not implemented');
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
