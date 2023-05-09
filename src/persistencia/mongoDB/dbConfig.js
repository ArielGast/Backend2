import mongoose from 'mongoose';
import config from '../../config.js';
import logger from '../../utils/winston.js';

const URI = config.uri;
try {
    mongoose.connect(URI);
    logger.info('Database connected')
    
} catch (error) {
    logger.error(`An error has occurred: ${error}`)
}