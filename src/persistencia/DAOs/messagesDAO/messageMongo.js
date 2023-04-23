import {messagesModel} from '../../mongoDB/models/messages.models.js';
import BasicMongo from '../basicMongo.js';

class MessageMongo extends BasicMongo {
    constructor(model) {
        super(model)
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

const messageMongo = new MessageMongo();
export default messageMongo;