import mongoose from 'mongoose';
import config from '../../config.js';

const URI = config.uri;
try {
    mongoose.connect(URI);
    console.log('Database connected')
    
} catch (error) {
    console.log(error)
}