import { IUserRepository } from "../interfaces/iUserRepository";
import UserModel, { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";

export class UserRepository implements IUserRepository {
  
  async deleteUser(userId: string): Promise<Object> {
    try{
      await UserModel.findByIdAndDelete(userId)
      return {success: true}
    }catch(e:any){
      throw new Error("db error")
    }
  }

  getInstructors() {
    try {
      const instructors = UserModel.find({ role: "instructor" });
      return instructors;
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async getUsers() {
    try {
      const users = UserModel.find({ role: "user" });
      return users;
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  updatePassword(id: string, password: string): Promise<IUser | null> {
    try {
      return UserModel.findByIdAndUpdate(id, { password });
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  avatarUpdate(id: string, avatar: string): Promise<IUser | null> {
    try {
      return UserModel.findByIdAndUpdate(id, { avatar });
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async findByIdAndUpdate(id: string, name: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, { name: name });
      return user;
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  register(userData: User): Promise<IUser | null> {
    try {
      return UserModel.create(userData);
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async findOne(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (e: any) {
      throw new Error("db error");
    }
  }
}
