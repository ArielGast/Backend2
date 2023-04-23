import cartService from '../services/cart.services.js';
import productService from '../services/product.services.js';

class CartController {
    async getCartByIdController (req, res) {
        try {
            const {cId} = req.params;
            const cart = await cartService.getCartByIdService(cId);
            res.status(200).json({messages: 'Carts found',cart});
        } catch (error) {
            res.status(500).json({error})
        }   
    }
    
    async addCartController (req, res) {
        try {
            const cart = await cartService.addCartService();
            res.status(200).json({status: 'Succes', message: 'Cart created'})
        } catch (error) {
            res.status(500).json({error})        
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
                    res.status(200).json({status: 'Succes', message: 'Product added'})
                } else {
                    res.status(400).json({status:'Error', message: 'Not added'})
                }   
            }  
        } catch (error) {
            res.status(500).json({error})                
        }
    }
    
    async deleteProductFromCartController (req,res) {
        try {
            const { cId, pId} = req.params;
            const request = await cartService.deleteProductFromCartService(cId, pId)
            if (request == 'Error') {
                res.status(400).json({status: 'Error', message: 'Product or cart not found'});
            }
            if (request == 'Succes') {
                res.status(200).json({status: 'Succes', message: 'Product remove from cart'});
            }
        } catch (error) {
            res.status(500).json({error})                        
        }
    }
    
    async updateCartController (req,res) {
        try {
            const {cId} = req.params;
            const productos = [];
            const request = await cartService.updateCartService(cId, productos);
            res.status(200).json({status: 'Succes', message: 'Cart updated'});
        } catch (error) {
            res.status(500).json({error})
        }
    }
    
    async  updateProductQtyController (req,res) {
        try {
            const {cId, pId} = req.params;
            const {newQty} = req.body;
            const response = await cartService.updateProductQtyService(cId, pId, newQty);
            if (response == 0) {
                res.status(404).json({status: 'Error', message: 'Not updated'})
            }else {
                res.status(200).json({status: 'Succes', message: 'Quantity updated'})
            }
        } catch (error) {
            res.status(500).json({error})
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
            res.status(500).json({error})
        }
    }

}

export default new CartController();

