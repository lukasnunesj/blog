import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as argon2 from "argon2";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialsDto;

        
        const user = this.create();
        user.username = username;
        user.password = await this.hashPassword(password);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException("User already exists!");
            } else {
                throw new InternalServerErrorException;
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {username, password} = authCredentialsDto;
        const user = await this.findOne({username});

        if(user && await user.validatePassword(password)){
            return user.username
        } else {
            return null
        }
    }

    private async hashPassword(password: string): Promise<string>{
        return argon2.hash(password);
    }
}