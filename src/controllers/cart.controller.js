import { addCartService,addToCartService,getCartByIdService,deleteAllProductsService,deleteProductFromCartService,updateCartService,updateProductQtyService } from "../services/cart.services.js";
import { getProductByIdController } from "./product.controller.js";


export async function getCartByIdController (req, res) {
    try {
        const {cId} = req.params;
        const cart = await getCartByIdService(cId);
        res.status(200).json({messages: 'Carts found',cart});
    } catch (error) {
        res.status(500).json({error})
    }   
}

export async function addCartController (req, res) {
    try {
        const cart = await addCartService();
        res.status(200).json({status: 'Succes', message: 'Cart created'})
    } catch (error) {
        res.status(500).json({error})        
    }
}

export async function addToCartController (req,res) {
    try {
        const {cId, pId} = req.params;
        const checkProduct = await getProductByIdController(pId); 
        const checkCart = await getCartByIdService(cId);
        if ( checkProduct == undefined || checkCart == null) {
            res.status(400).send({status: 'error', message: 'Product or cart not found'})
        } else {
            const response = await addToCartService(cId, pId);
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

export async function deleteProductFromCartController (req,res) {
    try {
        const { cId, pId} = req.params;
        const request = await deleteProductFromCartService(cId, pId)
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

export async function updateCartController (req,res) {
    try {
        const {cId} = req.params;
        const productos = [];
        const request = await updateCartService(cId, productos);
        res.status(200).json({status: 'Succes', message: 'Cart updated'});
    } catch (error) {
        res.status(500).json({error})
    }
}

export async function updateProductQtyController (req,res) {
    try {
        const {cId, pId} = req.params;
        const {newQty} = req.body;
        const response = await updateProductQtyService(cId, pId, newQty);
        if (response == 0) {
            res.status(404).json({status: 'Error', message: 'Not updated'})
        }else {
            res.status(200).json({status: 'Succes', message: 'Quantity updated'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

export async function deleteAllProductsController (req,res) {
    try {
        const {cId} = req.params;
        const response = await deleteAllProductsService(cId);
        if (response == 'Succes') {
            res.status(200).send({status: 'Succes' , message: 'Cart empty'});
        }else {
            res.status(400).send({status: 'Error', message: 'Error'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

