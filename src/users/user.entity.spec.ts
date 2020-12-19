import * as bcrypt from "bcrypt";
import { User } from "./user.entity";

describe('User entity', () => {
    let user: User;
    let spyHash;

    beforeEach(()=>{
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        spyHash = jest.spyOn(bcrypt, 'hash');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validatePassword', () => {
        it('should return true when password is valid', async () => {
            spyHash.mockResolvedValue('testPassword');

            expect(spyHash).not.toHaveBeenCalled();

            const result = await user.validatePassword('123456');

            expect(spyHash).toHaveBeenCalledWith('123456', 'testSalt');
            expect(result).toBeTruthy();
        });

        it('should return false when password is invalid', async () => {
            spyHash.mockResolvedValue('wrongPassword');

            expect(spyHash).not.toHaveBeenCalled();

            const result = await user.validatePassword('wrongPassword');
            
            expect(spyHash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toBeFalsy();
        })
        
        
    })
    
})
