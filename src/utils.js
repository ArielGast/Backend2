import {dirname} from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { log } from 'console';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashPassword = async (password) => {
    return bcrypt.hash(password,10);
}

export const comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
} 

faker.locale = 'es';

export const generateProducts =  async () => {
    console.log('ACA entra primero');
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alpha(3)+faker.random.numeric(3),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.random.numeric(4),
        category: faker.commerce.product(),
        thumbnail: faker.image.food()
    }
}
