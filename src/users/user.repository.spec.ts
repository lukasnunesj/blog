import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";

const mockCredentialsDTO = {
    username: "TestUsername",
    password: "TestPassword"
}

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ]
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;
        beforeEach(()=>{
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save })
        });

        it('signs up the user successfully', ()=>{
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow();
        });

        it('throws a conflict exception when user already exists', () => {
            save.mockRejectedValue({code:'23505'});
            expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(ConflictException);
        });

        it('throws exception when got any other error', () => {
            save.mockRejectedValue({code:'12345'});
            expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(InternalServerErrorException);
        });
    })

    describe('validateUserPassword', () => {
        let user;
        
        beforeEach(()=>{
            userRepository.findOne = jest.fn();

            user = new User();
            user.username = "TestUsername";

            user.validatePassword = jest.fn();
        });

        it('returns the user when it passes the validation', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialsDTO);
            expect(result).toEqual("TestUsername");
        });

        it('returns null when user is not found', async () => {
            userRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.validateUserPassword(mockCredentialsDTO);
            expect(user.validatePassword).not.toBeCalled();
            expect(result).toBeNull;
        });

        it('returns null when the password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockCredentialsDTO);
            expect(user.validatePassword).toBeCalled();
            expect(result).toBeNull;
        });
    });
    
    describe('hashPassword', () => {
        it('should call bycript to generate a hash of the password', async () => {
            const spyHash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('testHash');
            expect(spyHash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('TestPassword', 'testSalt');
            expect(spyHash).toHaveBeenCalledWith('TestPassword', 'testSalt');
            expect(result).toEqual('testHash');
        });
    });
    
})
