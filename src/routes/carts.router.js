import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';

const router = Router();


router.get('/:cId', cartController.getCartByIdController);
router.post ('/', cartController.addCartController);
router.post('/:cId/product/:pId',cartController.addToCartController);
router.delete('/:cId/products/:pId', cartController.deleteProductFromCartController);
router.put('/:cId', cartController.updateCartController);
router.put('/:cId/products/:pId', cartController.updateProductQtyController);
router.delete('/:cId', cartController.deleteAllProductsController);

export default router
