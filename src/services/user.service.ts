import { IUserService } from "../interfaces/iUserInterface";
import { IUserRepository } from "../interfaces/iUserRepository";
import { User } from "../model/user.entities";
import { CreateActivationToken } from "./utils/activationToken";
import jwt, { Secret } from 'jsonwebtoken';
import 'dotenv/config';

export class UserService implements IUserService {

    private repository: IUserRepository;

    constructor(repository: IUserRepository){
        this.repository = repository;
    }

    async activateUser(data: { token: string; activationCode: string; }) {
        const {token, activationCode} = data;
        const newUser = jwt.verify(token, process.env.JWT_SECRET as Secret) as {user: User, activationCode: string}
        
        if(newUser.activationCode !== activationCode){
            throw new Error("Invalid Code.");
        }

        const existUser = await this.repository.findOne(newUser.user.email)
        
        if(existUser){
            return null
        }
       return this.repository.register(newUser.user);    
    }


    async userRegister(userData: any) {
        try{
            const isEmailExist = await this.repository.findOne(userData.email);
            if(isEmailExist){
                return null;
            }
            const activationToken = CreateActivationToken(userData);
            return activationToken
        }catch(err){
            return null;
        }
    }

    async userLogin(email: string, password: string) {
        
        const user = await this.repository.findOne(email)
        if(!user){
            throw new Error('invalid email')
        }

        const isPassword = await user.comparePassword(password);
        if(!isPassword){
            throw new Error('invalid password')
        }
        const accessToken = user.SignAccessToken();
        const refreshToken = user.SignRefreshToken();

        return {accessToken, refreshToken}
    }
    
    getUser(email: string): Promise<User | null> {
        return this.repository.findOne(email)
    }
}