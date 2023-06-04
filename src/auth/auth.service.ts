import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.types';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  
  /**
   * Regresa el token firmado en base al id del usuario
   * @param userId id del usuario
   */
  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = this.getJwtToken(user.id);
    
    return {
      token,
      user,
    };
  }
  
  /**
   * Inicio de sesion
   */
  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    
    const user = await this.usersService.findOneByEmail(email);
    
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('email/password mismatch');
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with admnistrator');

    delete user.password; // Removemos el password para que no este en el objeto

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    }
  }
}
