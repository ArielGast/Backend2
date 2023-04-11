import {messagesModel} from './models/messages.models.js';

export default class MessageManager {

    async addMenssage (obj) {
        try {
            const newMessage = await messagesModel.create(obj)
            return newMessage
        }catch (error) {
            console.log(error);
        }
    }

    async getMessages () {
        try {
            const messages = await messagesModel.find().lean();
            return messages
            
        }catch (error) {
            return error;
        }
    }

}