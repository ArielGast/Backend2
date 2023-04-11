import { usersModel } from "./models/users.models.js";

export default class UserManager {

    async findUser(email) {
        try {
            const user = await usersModel.findOne({email});
            return user;
        } catch (error) {
            return error;
        }
    }

    async createUser(obj) {
        try {
            const newUser = await usersModel.create(obj);
            return newUser;
        } catch (error) {
            return error;    
        }
    }

    async findUserById(id) {
        try {
            const user = await usersModel.findById(id);
            return user;
        } catch (error) {
            return error;
        }
    }

}