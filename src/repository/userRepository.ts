import { IUserRepository } from "../interfaces/iUserRepository";
import UserModel, { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";

export class UserRepository implements IUserRepository {

  async getUserAnalytics(instructorId: string): Promise<Object[] | null> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const matchStage: any = {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      };
      if (instructorId !== "admin") {
        matchStage.$match.instructorId = instructorId;
      }

      const response = await UserModel.aggregate([
        matchStage,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]);

      return response || [];
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async updateCourseList(
    userId: string,
    courseId: string
  ): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      user?.courses.push({ courseId });
      await user?.save();
      return null;
    } catch (e: any) {
      throw new Error("db error");
    }
  }

  async deleteUser(userId: string): Promise<Object> {
    try {
      await UserModel.findByIdAndDelete(userId);
      return { success: true };
    } catch (e: any) {
      throw new Error("db error");
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
