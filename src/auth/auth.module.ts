import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
  imports: [
    ConfigModule,

    UsersModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '4h',
        },
      }),
    }),
  ],
})
export class AuthModule {}
