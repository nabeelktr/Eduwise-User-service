import path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader" 
import "dotenv/config"
import { connectDB } from "./config/mongodb/db"
import {UserHandlers} from '../proto/user_package/User';
import { ProtoGrpcType } from "../proto/user";
import { UserRepository } from "./repository/userRepository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/userController";
import RabbitMQClient from "./events/rabbitmq/client";


connectDB();

const packageDef = protoLoader.loadSync(path.resolve(__dirname, './protos/user.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const userpackage = grpcObject.user_package

const repository = new UserRepository()
const service = new UserService(repository);
export const controller = new UserController(service)

const server = new grpc.Server()

const grpcServer = () => {
    server.bindAsync(`0.0.0.0:${process.env.USER_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if(err){
                console.log(err);
                return
            }
            console.log('grpc-user server started on port ', port);
        }
    )
}

server.addService(userpackage.User.service, {
    Register : controller.onRegister.bind(controller),
    ActivateUser : controller.activateUser.bind(controller),
    Login : controller.loginUser.bind(controller),
    GetUser: controller.getUser.bind(controller),
    SocialAuth: controller.socialAuth.bind(controller),
    UpdateUserInfo: controller.updateUserInfo.bind(controller),
    UpdateAvatar: controller.updateAvatar.bind(controller),
    UpdatePassword: controller.updatePassword.bind(controller),
    UpdateCourseList: controller.updateCourseList.bind(controller),
    GetUsersAnalytics: controller.getUserAnalytics.bind(controller)
} as UserHandlers)

grpcServer();
RabbitMQClient.initialize();