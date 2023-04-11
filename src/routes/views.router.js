import { Router } from 'express';
import {getProductsForHandleController, getPorductsController, getProductsForPerfilController} from '../controllers/product.controller.js'
import  MessageManager  from '../dao/messageManager.js';
import { auth, isLogged, isAdmin } from '../middlewares/auth.middleware.js';


const router = Router();

const messageManager = new MessageManager();  

router.get('/', async (req, res) => {
    const products = await getProductsForHandleController()
    if (products) {
        res.render('index', {products})
        
    }
});

router.get ('/realtimeproducts',  async (req,res) => {
    const products = getProductsForHandleController()
    res.render('realTimeProducts', {products})
})

router.get ('/chat', async(req,res) => {

    const newMessage = await messageManager.getMessages();
    res.render ('chat', newMessage)
})

router.get ('/products', getProductsForHandleController )

router.get('/registro', isLogged, (req,res) => {
    res.render('registro')
})

router.get('/errorRegistro', (req,res) =>{
    res.render('errorRegistro');
})

router.get('/login', isLogged, (req,res) =>{
    res.render('login')
})

router.get('/perfil', auth, isAdmin, getProductsForPerfilController)

router.get('/errorLogin', (req,res) =>{
    res.render('errorLogin');
})

export default router