import { Router } from 'express';
import { getCartByIdController, addCartController, addToCartController, deleteProductFromCartController, updateCartController, updateProductQtyController,deleteAllProductsController  } from '../controllers/cart.controller.js';

const router = Router();


router.get('/:cId', getCartByIdController);
router.post ('/', addCartController);
router.post('/:cId/product/:pId',addToCartController);
router.delete('/:cId/products/:pId', deleteProductFromCartController);
router.put('/:cId', updateCartController);
router.put('/:cId/products/:pId', updateProductQtyController);
router.delete('/:cId', deleteAllProductsController);

export default router
