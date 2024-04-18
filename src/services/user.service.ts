import { IUserService } from "../interfaces/iUserInterface";
import { IUserRepository } from "../interfaces/iUserRepository";
import { User } from "../model/user.entities";
import { CreateActivationToken } from "./utils/activationToken";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Params } from "./types/interface";
import { s3 } from "./utils/s3";
import crypto from "crypto";
import sharp from "sharp";
import bcrypt from "bcryptjs";

export class UserService implements IUserService {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async getUserAnalytics(instructorId:string): Promise<[{ month: string; count: number; }] | null>{
    const months: { month: string; value: string }[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        value: date.toISOString().slice(0, 7),
      });
    }

    const response = await this.repository.getUserAnalytics(instructorId);
    const aggregatedData: Record<string, number> = {};
    if (response) {
      response.forEach(({ _id, count }: any) => {
        aggregatedData[_id] = count;
      });
    } else {
      return null;
    }

    const output: any = months.map(({ month, value }) => ({
      month,
      count: aggregatedData[value] || 0,
    }));

    return output;
  }

  async updateCourseList(userId: string, courseId: string) {
    await this.repository.updateCourseList(userId, courseId);
    return;
  }

  deleteUser(userId: string): Promise<Object> {
    return this.repository.deleteUser(userId);
  }

  getInstructors() {
    return this.repository.getInstructors();
  }

  getUsers() {
    return this.repository.getUsers();
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    userId: string
  ) {
    const user = await this.repository.findById(userId);
    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      throw new Error("Invalid Password");
    }
    const password = await bcrypt.hash(newPassword || "", 10);
    await this.repository.updatePassword(userId, password);
    return;
  }

  async updateAvatar(
    data: Buffer,
    fieldName: string,
    mimeType: string,
    id: string
  ) {
    const randomImageName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString("hex");
    const bucketName = process.env.S3_BUCKET_NAME || "";
    const buffer = await sharp(data)
      .resize({ height: 600, width: 600, fit: "cover" })
      .toBuffer();

    const imageName = `eduwise-profile/${randomImageName()}`;
    const params: S3Params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: mimeType,
    };
    const command = new PutObjectCommand(params);

    const rslt = await s3.send(command);
    const url = `https://eduwise.s3.ap-south-1.amazonaws.com/${imageName}`;
    await this.repository.avatarUpdate(id, url);
    return { success: true };
  }

  async updateUserInfo(id: string, name: string) {
    const user = await this.repository.findByIdAndUpdate(id, name);
    if (user) {
      const response = { status: 201, msg: "User info updated successfully" };
      return response;
    } else {
      throw new Error("User not found");
    }
  }

  async activateUser(data: { token: string; activationCode: string }) {
    const { token, activationCode } = data;
    const newUser = jwt.verify(token, process.env.JWT_SECRET as Secret) as {
      user: User;
      activationCode: string;
    };

    if (newUser.activationCode !== activationCode) {
      throw new Error("Invalid Code.");
    }

    const existUser = await this.repository.findOne(newUser.user.email);

    if (existUser) {
      return null;
    }
    return this.repository.register(newUser.user);
  }

  async userRegister(userData: User) {
    try {
      const isEmailExist = await this.repository.findOne(userData.email);
      if (isEmailExist) {
        if (!userData.avatar) {
          throw new Error("Email Already Exists");
        } else {
          const accessToken = isEmailExist.SignAccessToken();
          const refreshToken = isEmailExist.SignRefreshToken();
          return { accessToken, refreshToken, user: isEmailExist };
        }
      } else {
        if (!userData.avatar) {
          const activationToken = CreateActivationToken(userData);
          return activationToken;
        }
        const user = await this.repository.register(userData);
        const accessToken = user?.SignAccessToken();
        const refreshToken = user?.SignRefreshToken();
        return { accessToken, refreshToken, user };
      }
    } catch (err) {
      return null;
    }
  }

  async userLogin(email: string, password: string) {
    const user = await this.repository.findOne(email);
    if (!user) {
      throw new Error("invalid email");
    }

    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      throw new Error("invalid password");
    }
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    return { accessToken, refreshToken, user };
  }

  async getUser(id: string): Promise<User | any> {
    const user = await this.repository.findById(id);
    return user;
  }
}
