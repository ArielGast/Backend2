import { usersModel } from "../../mongoDB/models/users.models.js";
import BasicMongo from "../basicMongo.js";

class UserMongo extends BasicMongo {
    constructor(model) {
        super(model)
    }

}

const userMongo = new UserMongo(usersModel);
export default userMongo
