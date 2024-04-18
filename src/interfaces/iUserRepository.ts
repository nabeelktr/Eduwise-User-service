import { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";

export interface IUserRepository {
  getUserAnalytics(instructorId: string): Promise<Object[] | null>;
  register(userData: User): Promise<IUser | null>;
  findOne(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByIdAndUpdate(id: string, name: string): Promise<IUser | null>;
  avatarUpdate(id: string, avatar: string): Promise<IUser | null>;
  updatePassword(id: string, password: string): Promise<IUser | null>;
  getUsers(): any;
  getInstructors():any;
  deleteUser(userId:string): Promise<Object>;
  updateCourseList(userId: string, courseId: string): Promise<IUser | null>;

}
