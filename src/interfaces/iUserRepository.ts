import { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";


export interface IUserRepository {
    register(userData: User): any;
    findOne(email: string): Promise<IUser | null>;
}