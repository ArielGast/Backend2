import ticketMongo from "../persistencia/DAOs/ticketsDAO/ticketsMongo.js";

class TicketService {
    constructor () {
        this.dao = ticketMongo;
    }

    async createTicket (obj) {
        try {
            const newTicket = await this.dao.create(obj);
            return newTicket;
        } catch (error) {
            return error;
        }
    }
}

const ticketService = new TicketService();
export default ticketService;