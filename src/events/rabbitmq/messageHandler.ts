import rabbitClient from "./client";
import { controller } from "../../server";

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log("The operation in user service is", operation, data);

    switch (operation) {
      case "get-users":
        response = await controller.getUsers.bind(controller)();
        break;
      case "get-instructors":
        response = await controller.getInstructors.bind(controller)();
        break;

      case "delete-user":
        response = await controller.deleteUser.bind(controller)(data);
        break;

      default:
        response = "Request-key notfound";
        break;
    }

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
