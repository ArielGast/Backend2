import {dirname} from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker'
import  jwt  from 'jsonwebtoken';
import config from './config.js';

const privateJwtKey = config.private_key;

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashPassword = async (password) => {
    return bcrypt.hash(password,10);
}

export const comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
} 

faker.locale = 'es';

export const generateProducts =  async () => {
    return {
        //_id: faker.database.mongodbObjectId(),
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

export const generateToken = (user) => {
    const token = jwt.sign({user}, privateJwtKey,{expiresIn:'1h'});
    return token
}

export const authToken = (req,res,next) => {
    const token = req.query.token;
    if(!token)  return res.status(400).send({error: 'Not authenticated'});
    jwt.verify(token, privateJwtKey, (error, credentials) =>{
        if(error) return res.status(400).send({error: 'Not authenticated'});
        req.user = credentials.user;
        next();

    })
}

