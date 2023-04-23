import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import  messageMongo from '../persistencia/DAOs/messagesDAO/messageMongo.js';
import { auth, isLogged, isAdmin } from '../middlewares/auth.middleware.js';


const router = Router();


router.get('/', async (req, res) => {
    const products = await productController.getProductsForHandleController()
    if (products) {
        res.render('index', {products})
        
    }
});

router.get ('/realtimeproducts',  async (req,res) => {
    const products = productController.getProductsForHandleController()
    res.render('realTimeProducts', {products})
})

router.get ('/chat', async(req,res) => {

    const newMessage = await messageMongo.getMessages();
    res.render ('chat', newMessage)
})

router.get ('/products', productController.getProductsForHandleController )

router.get('/registro', isLogged, (req,res) => {
    res.render('registro')
})

router.get('/errorRegistro', (req,res) =>{
    res.render('errorRegistro');
})

router.get('/login', isLogged, (req,res) =>{
    res.render('login')
})

router.get('/perfil', auth, isAdmin, productController.getProductsForPerfilController)

router.get('/errorLogin', (req,res) =>{
    res.render('errorLogin');
})

export default router