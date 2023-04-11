import UserManager from '../dao/userManager.js'

const userManager = new UserManager();

export async function findUserService (email) {
    try {
        const user = await userManager.findUser(email);
        return user
    } catch (error) {
        return error;
    }
}

export async function createUserService (user) {
    try {
        const newUser = await userManager.createUser(user);
        return newUser;
    } catch (error) {
        return error;    
    }
}

export async function findUserByIdService(idU) {
    try {
        const user = await userManager.findUserById(idU);
        return user;
    } catch (error) {
        return error;
    }
}
