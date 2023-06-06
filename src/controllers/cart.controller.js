import cartService from '../services/cart.services.js';
import productService from '../services/product.services.js';
import ticketService from '../services/ticket.services.js';
import logger from '../utils/winston.js';

class CartController {
    async getCartByIdController (req, res) {
        try {
            const {cId} = req.params;
            const cart = await cartService.getCartByIdService(cId);
            return res.status(200).json({messages: 'Carts found',cart});
        } catch (error) {
            logger.info('Cart not found');
            return res.status(500).json({error})
        }   
    }
    
    async addCartController (req, res) {
        try {
            const cart = await cartService.addCartService();
            return res.status(200).json({status: 'Succes', message: 'Cart created'})
        } catch (error) {
            return res.status(500).json({error})        
        }
    }
    
    async addToCartController (req,res) {
        try {
            const {cId, pId} = req.params;
            const checkProduct = await productService.getProductByIdController(pId); 
            const checkCart = await cartService.getCartByIdService(cId);
            if ( checkProduct == undefined || checkCart == null) {
                res.status(400).send({status: 'error', message: 'Product or cart not found'})
            } else {
                const response = await cartService.addToCartService(cId, pId);
                if (response){
                    return res.status(200).json({status: 'Succes', message: 'Product added'})
                } else {
                    return res.status(400).json({status:'Error', message: 'Not added'})
                }   
            }  
        } catch (error) {
            return res.status(500).json({error})                
        }
    }
    
    async deleteProductFromCartController (req,res) {
        try {
            const { cId, pId} = req.params;
            const request = await cartService.deleteProductFromCartService(cId, pId)
            if (request == 'Error') {
                 return res.status(400).json({status: 'Error', message: 'Product or cart not found'});
            }
            if (request == 'Succes') {
                return res.status(200).json({status: 'Succes', message: 'Product remove from cart'});
            }
        } catch (error) {
            return res.status(500).json({error})                        
        }
    }
    
    async updateCartController (req,res) {
        try {
            const {cId} = req.params;
            const productos = [];
            const request = await cartService.updateCartService(cId, productos);
             return res.status(200).json({status: 'Succes', message: 'Cart updated', request});
        } catch (error) {
            return res.status(500).json({error})
        }
    }
    
    async  updateProductQtyController (req,res) {
        try {
            const {cId, pId} = req.params;
            const {newQty} = req.body;
            const response = await cartService.updateProductQtyService(cId, pId, newQty);
            if (response == 0) {
                return res.status(404).json({status: 'Error', message: 'Not updated'})
            }else {
               return res.status(200).json({status: 'Succes', message: 'Quantity updated'})
            }
        } catch (error) {
           return res.status(500).json({error})
        }
    }
    
    async deleteAllProductsController (req,res) {
        try {
            const {cId} = req.params;
            const response = await cartService.deleteAllProductsService(cId);
            if (response == 'Succes') {
                res.status(200).send({status: 'Succes' , message: 'Cart empty'});
            }else {
                res.status(400).send({status: 'Error', message: 'Error'})
            }
        } catch (error) {
            return res.status(500).json({error})
        }
    }

    async purchaseController (req,res) {
        try {
            const {email} = req.session;
            let noPurchase = [];
            let totalPurchase = 0;
            const {cId} = req.params;
            const cart = await cartService.getCartByIdService(cId);
            if (!cart || cart.products.length == 0) {
                return res.status(404).json({message: 'Cart not found or empty'})
            }
            for(const product of cart.products) {
                const productData = await productService.getProductByIdService(product._id);
                if (!productData) {
                    return res.status(404).json({message: 'Product not found'})
                }    
                if (productData.stock < product.quantity) {
                    noPurchase.push(productData._doc);
                } else {
                    const newQty = productData.stock - product.quantity;
                    const updatedProduct= {...productData._doc, stock: newQty };
                    await productService.updateProductService(product._id, updatedProduct)
                    totalPurchase += product.quantity * productData.price;
                }
            }
            const ticketData = {
                code: 'A -'+ (1000000000*Math.random()).toFixed(0),
                purchase_datetime: new Date(),
                amount: totalPurchase,
                purchaser: email
            }
            const ticket =  await ticketService.createTicket(ticketData);
            await cartService.deleteAllProductsService(cId);
            if (noPurchase.length > 0) await cartService.updateCartService(cId, {products: noPurchase});
            return res.json({message: 'Succeful Purchase', ticket})          
        } catch (error) {
            return res.status(500).json({error})
        }
    }
}

export default new CartController();

