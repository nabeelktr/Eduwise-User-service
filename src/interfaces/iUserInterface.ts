import { User } from "../model/user.entities";

export interface IUserService {
  userRegister(userData: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
  }): any;
  activateUser(data: { token: string; activationCode: string }): any;
  getUser(id: string): Promise<User | any>;
  userLogin(email: string, password: string): any;
  updateUserInfo(id: string, name: string): any;
  updateAvatar(
    data: Buffer,
    fieldName: string,
    mimeType: string,
    id: string
  ): any;
  updatePassword(oldPassword: string, newPassword: string, userId: string): any;
  getUsers(): any;
  getInstructors(): any;
}
