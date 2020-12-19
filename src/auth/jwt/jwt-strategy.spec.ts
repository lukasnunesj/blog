import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "../../users/user.entity";
import { UserRepository } from "../../users/user.repository";
import { JwtStrategy } from "./jwt-strategy";

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JWT strategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository, useFactory: mockUserRepository}
            ]
        }).compile();
        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);

    });

    describe('validate', () => {
        it('should validate and return a user based on JWT payload', async () => {
            const user = new User();
            user.username = 'TestUsername';

            userRepository.findOne.mockResolvedValue(user);

            const result = await jwtStrategy.validate({username: 'TestUsername'});

            expect(userRepository.findOne).toHaveBeenCalledWith({username: 'TestUsername'});
            expect(result).toEqual(user);

        });

        test('should return an unauthorized exception if the user doesn\'t exists', () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({username: 'TestUsername'})).rejects.toThrow(UnauthorizedException);
        })
        
        
    })
    

})
