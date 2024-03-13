import { User } from "../model/user.entities";

export interface IUserService {

    userRegister(userData:{
        name: string,
        email: string,
        password: string,
    }):any;

    activateUser(data: {
        token: string,
        activationCode: string,
    }):any;

    getUser(id:string):Promise<User | null>;
    userLogin(email: string, password: string):any;
}