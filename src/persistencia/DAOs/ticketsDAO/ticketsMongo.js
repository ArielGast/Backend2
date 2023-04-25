import { ticketModel } from "../../mongoDB/models/ticketsModel.js";
import BasicMongo from "../basicMongo.js";

class TicketMongo extends BasicMongo {
    constructor(model) {
        super(model)
    }
}

const ticketMongo = new TicketMongo(ticketModel);
export default ticketMongo;