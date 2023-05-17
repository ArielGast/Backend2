import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { AdminPermission, AdminPremiumPermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', productController.getPorductsController);
router.get('/:pId', productController.getProductByIdController);
router.post('/' ,productController.addProductController);
router.put('/:pId', AdminPermission ,productController.updateProductController);
router.delete('/:pId', AdminPremiumPermission, productController.deleteProductController);

export default router