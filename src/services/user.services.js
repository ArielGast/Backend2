import userMongo from "../persistencia/DAOs/usersDAO/usersMongo.js";

class UserService {
    constructor() {
        this.dao = userMongo;
    }
    async findUserService (email) {
        try {
            const user = await this.dao.findByEmail(email);
            return user
        } catch (error) {
            return error;
        }
    }
    
    async createUserService (user) {
        try {
            const newUser = await this.dao.create(user);
            return newUser;
        } catch (error) {
            return error;    
        }
    }
    
    async findUserByIdService(idU) {
        try {
            const user = await this.dao.findOne(idU);
            return user;
        } catch (error) {
            return error;
        }
    }

    async findAllService() {
        try {
            const allUsers = await this.dao.findAll();
            return allUsers;
        } catch (error) {
            return error;
        }
    }

    async updateUser (obj) {
        try {
            const updateUser = await this.dao.updateOne(obj);
            return updateUser
        } catch (error) {
            return error
        }
    }

    async findOneAndUpdate (email, obj) {
        try {
            const response = await this.dao.userFindOneAndUpdate(email, obj);
            return response;
        } catch (error) {
            return error
        }
    }

    async deleteOneService(id) {
        try {
            const response = await this.dao.deleteOne(id);
            return response;
        } catch (error) {
            return error;
        }
    }
}
 const userService = new UserService();
 export default userService;
