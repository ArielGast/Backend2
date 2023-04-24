import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { UserPermission } from '../middlewares/auth.middleware.js';

const router = Router();


router.get('/:cId', cartController.getCartByIdController);
router.post ('/', cartController.addCartController);
router.post('/:cId/product/:pId',UserPermission, cartController.addToCartController);
router.delete('/:cId/products/:pId', UserPermission,cartController.deleteProductFromCartController);
router.put('/:cId', cartController.updateCartController);
router.put('/:cId/products/:pId', UserPermission,cartController.updateProductQtyController);
router.delete('/:cId', UserPermission ,cartController.deleteAllProductsController);

export default router
