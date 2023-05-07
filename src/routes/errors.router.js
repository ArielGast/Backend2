import { Router } from "express";
import logger from "../utils/winston.js";

const router = Router();

router.get('/', (req,res) => {
    logger.fatal('log Error');
    logger.error('log Error');
    logger.warning('log Error');
    logger.info('log Error');
    logger.http('log Error');
    logger.debug('log Error');
    res.send('Probando loggers');

})

export default router;