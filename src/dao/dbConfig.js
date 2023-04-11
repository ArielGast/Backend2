import mongoose from 'mongoose';
import config from '../config.js'

const URI = config.uri; //'mongodb+srv://arielgast:pepe1234@cluster0.a5yoyot.mongodb.net/ecommerce?retryWrites=true&w=majority'
try {
    mongoose.connect(URI);
    console.log('Database connected')
    
} catch (error) {
    console.log(error)
}