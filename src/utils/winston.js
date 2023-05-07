import winston from "winston";
import config from '../config.js';


const customLevels = {
    levels: { 
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
};
let logger;
const colors = customLevels.colors
winston.addColors(colors);

if (config.node_env === 'development') {
        logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ]
    })
} else if ( config.node_env === 'production'){
        logger = winston.createLogger({
        levels: customLevels.levels,
        transports: [
            new winston.transports.File({
                level: 'info',
                filename: './errors.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    })
}

export default logger;
