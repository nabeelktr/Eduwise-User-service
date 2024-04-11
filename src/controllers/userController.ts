import {UserHandlers} from '../../proto/user_package/User'
import { IUserService } from "../interfaces/iUserInterface";
import publisher from '../events/publisher/user.publisher'

export class UserController {

    private service : IUserService;

    constructor(service: IUserService) {
        this.service = service;
    }

    onRegister : UserHandlers['Register']= async (call, callback) => {
        try{
            const request = call.request as { name: string; email: string; password: string; };
            const response = await this.service.userRegister(request)
            if(!response){
                throw new Error("Email Already Exists")
            }else{
                const data = {
                    code: response.activationCode,
                    name: request.name,
                    email: request.email
                }
                publisher.ActivationCode(data);
                callback(null, {
                    msg : "Activation code send to the email",
                    data: response,
                    status: 201,
                })
            }
        }
        catch(e: any){
            callback(e, null)
        }
    }

    activateUser: UserHandlers['ActivateUser'] = async (call, callback) => {
        try{
            const request = call.request as {token: string, activationCode: string};
            const response = await this.service.activateUser(request)
            if(!response){
                callback(null, {
                    msg: "Email Already exists",
                    status: 409
                })
            }else{
                callback(null, {msg: 'successfully registered', status: 201})
            }
        }catch(e:any){
            callback(e, null)
        }
    }

    loginUser: UserHandlers['Login']= async (call, callback) => {
        try{
            const {email, password} = call.request as {email: string, password: string}
            const response = await this.service.userLogin(email, password)
            callback(null, response)
        }catch(e: any){
            callback(e, null)
        }
    }

    getUser: UserHandlers['GetUser'] = async(call, callback) => {
        try{
            const response: any = await this.service.getUser(call.request.id as string)
            if(response){
                callback(null, response);
            }
        }catch(e:any){
            callback(e, null)
        }
    }

    socialAuth: UserHandlers['SocialAuth'] = async(call, callback) => {
        try{
            const request = call.request as {email:string, name:string, avatar:string};
            const response = await this.service.userRegister(request);
            callback(null, response)
        }catch(e:any){
            callback(e, null)
        }
    }

    updateUserInfo: UserHandlers['UpdateUserInfo'] = async(call, callback) => {
        try{
            const {userId, name} = call.request as {userId:string, name:string};
            const response = await this.service.updateUserInfo(userId, name)
            callback(null, response);
        }catch(e: any){
            callback(e, null)
        }
    }

    updateAvatar: UserHandlers['UpdateAvatar'] = async(call, callback) => {
        try{
            const {data, filename, mimetype, id} = call.request as {data: Buffer, filename: string, mimetype: string, id:string};
            const response = await this.service.updateAvatar(data, filename, mimetype, id)
            callback(null, {status: 201, msg:"avatar updated"})
        }catch(e: any){
            callback(e, null)
        }
    }

    updatePassword: UserHandlers['UpdatePassword'] = async(call, callback) => {
        try{
            const {oldPassword, newPassword, userId} = call.request as {oldPassword: string, newPassword:string, userId: string}
            const reponse = await this.service.updatePassword(oldPassword, newPassword, userId)
            callback(null, {msg: "password updated", status:200})
        }catch(e: any){
            callback(e, null)
        }
    }

    getUsers = async () => {
        try{
            const response = await this.service.getUsers()
            return response
        }catch(e:any){
            console.log(e);
        }
    }

    getInstructors = async () => {
        try{
            const response = await this.service.getInstructors()
            return response
        }catch(e:any){
            console.log(e);
        }
    }

    deleteUser = async (userId:string) => {
        try{
            const response = await this.service.deleteUser(userId)
            return response
        }catch(e:any){
            console.log(e);
        }
    }

    updateCourseList: UserHandlers['UpdateCourseList'] = async(call, callback) => {
        try{
            const { userId, courseId} = call.request as {userId: string, courseId: string}
            const reponse = await this.service.updateCourseList( userId, courseId)
            callback(null, {msg: "course list updated", status:200})
        }catch(e: any){
            callback(e, null)
        }
    }
}