import { Injectable, BadRequestException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.types';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = 'ABC123';

    return {
      token,
      user
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {

    const {email, password} = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    if(!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('email/password mismatch');
    }

    const token = 'ABC123';

    return {
      token,
      user
    }
  }
}
