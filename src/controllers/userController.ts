import {UserHandlers} from '../../proto/user_package/User'
import { IUserService } from "../interfaces/iUserInterface";

export class UserController {

    private service : IUserService;

    constructor(service: IUserService) {
        this.service = service;
    }

    OnRegister : UserHandlers['Register']= async (call, callback) => {
        try{
            const request = call.request as { name: string; email: string; password: string; };
            const response = await this.service.userRegister(request)
            console.log(response);
            if(!response){
                callback(null, {
                    msg : "Email Already exist",
                    data : {},
                    status: 409})
            }else{
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
}