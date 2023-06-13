import { usersModel } from "../../mongoDB/models/users.models.js";
import BasicMongo from "../basicMongo.js";

class UserMongo extends BasicMongo {
    constructor(model) {
        super(model)
    }

    async userFindOneAndUpdate(filter, obj) {
        try {
            const userupdate = await usersModel.findOneAndUpdate(filter, obj);
            return userupdate
        } catch (error) {
            return error
        }
    }
}

const userMongo = new UserMongo(usersModel);
export default userMongo
