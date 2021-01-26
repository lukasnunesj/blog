import * as argon2 from "argon2";
import { User } from "./user.entity";

describe('User entity', () => {
    let user: User;
    let spyHash;

    beforeEach(async () => {
        user = new User();
        user.password = await argon2.hash('testPassword');
        spyHash = jest.spyOn(argon2, 'verify');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validatePassword', () => {
        it('should return true when password is valid', async () => {
            expect(spyHash).not.toHaveBeenCalled();
            
            const result = await user.validatePassword('testPassword');

            expect(spyHash).toHaveBeenCalledWith(user.password, 'testPassword');
            expect(result).toBeTruthy();
        });

        it('should return false when password is invalid', async () => {
            expect(spyHash).not.toHaveBeenCalled();
            
            const result = await user.validatePassword('wrongPassword');
            
            expect(spyHash).toHaveBeenCalledWith(user.password, 'wrongPassword');
            expect(result).toBeFalsy();
        })
        
        
    })
    
})
