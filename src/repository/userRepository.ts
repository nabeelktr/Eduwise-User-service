import { IUserRepository } from "../interfaces/iUserRepository";
import UserModel, { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";

export class UserRepository implements IUserRepository {
    async findById(id: string): Promise<IUser | null> {
      const user = await UserModel.findById(id).select('-password');
      return user;
    }
    
    register(userData: User): any {
        return UserModel.create(userData);
    }

    async findOne(email: string): Promise<IUser | null> {
      const user = await UserModel.findOne({email}) 
      return user
    }
    
}