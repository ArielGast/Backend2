import express from 'express';
import {__dirname} from './utils.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import session from 'express-session';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import cookieParser from 'cookie-parser';
import productMongo from './persistencia/DAOs/productsDAO/productsMongo.js';
import './persistencia/mongoDB/dbConfig.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './passport/passportStrategies.js';
import sessionsRouter from './routes/sessions.router.js';
import config from './config.js';
import mockingRouter from './routes/mock.router.js';
import { errorMiddleware } from './utils/errors/error.middleware.js';
import errorsRouter from './routes/errors.router.js';
import logger from './utils/winston.js';


const app = express();
const PORT = config.port;



//Session Mongo
app.use(cookieParser());
app.use(
    session({
        store: new MongoStore({
            mongoUrl: config.uri 
        }),
        resave:false,
        saveUninitialized: false,
        secret: 'sessionKey',
        cookie:{maxAge:20000}
    }))
    
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use('/views',viewsRouter );
app.get('/', (req,res) =>{
    res.redirect('/views/login')
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views', viewsRouter);
app.use('/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/loggerTest', errorsRouter);
app.use(cookieParser());
app.use(errorMiddleware);



const httpServer = app.listen(PORT, ()=> {
    logger.http(`Escuchando al puerto ${PORT}`);
})
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    logger.http('Cliente conectado', socket.id)
    socket.on('disconnect', () => {
        logger.info('Cliente desconectado')
    })
    
    socket.on('render', async () => {
        let productos = [];
        productos = await productMongo.getProducts()
        if (productos.length !== 0){         
            socketServer.emit('renderizado', productos )
        } else {
            socketServer.emit('MsjError', 'Error en la petición')
        }
    })

    socket.on('agregar', async (obj) => {
        await productManager.addProduct(obj)
        const productos = await productMongo.getProductsForHandle()
        if (productos) {
            socketServer.emit('Agregado', productos);
        }else {
            socketServer.emit('MsjError', 'Request Error')
        }

    })

    socket.on('borrar', async (id) => {
        const productoAborrar = await productMongo.deleteOne(id);
        const newProducts = await productMongo.getProductsForHandle();
        if (productoAborrar) {
            socketServer.emit('borrado', newProducts )
        }else {
            socketServer.emit('MsjError', 'No existe el id ingresado')
        }
    })

    socket.on('enviar', async (obj) => {
        await messageManager.addMenssage(obj);
        const mensajes = await messageManager.getMessages()
        socketServer.emit('mensajes', mensajes )
    })
  
});