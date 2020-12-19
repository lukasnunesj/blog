import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
        secret: 'topsecret',
        signOptions: {
            expiresIn: 3600
        }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ],
  controllers: [AuthController],
})
export class AuthModule {}
