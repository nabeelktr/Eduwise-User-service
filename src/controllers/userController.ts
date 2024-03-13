import {UserHandlers} from '../../proto/user_package/User'
import { IUserService } from "../interfaces/iUserInterface";
import publisher from '../events/publisher/user.publisher'
import { IUser } from '../model/schemas/user.schema';
import { User } from '../model/user.entities';

export class UserController {

    private service : IUserService;

    constructor(service: IUserService) {
        this.service = service;
    }

    OnRegister : UserHandlers['Register']= async (call, callback) => {
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

    ActivateUser: UserHandlers['ActivateUser'] = async (call, callback) => {
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

    LoginUser: UserHandlers['Login']= async (call, callback) => {
        try{
            const {email, password} = call.request as {email: string, password: string}
            const response = await this.service.userLogin(email, password)

            callback(null, response)
        }catch(e: any){
            callback(e, null)
        }
    }

    GetUser: UserHandlers['GetUser'] = async(call, callback) => {
        try{
            const response: any = await this.service.getUser(call.request.id as string)
            if(response){
                callback(null, response);
            }
        }catch(e:any){
            callback(e, null)
        }
    }
}