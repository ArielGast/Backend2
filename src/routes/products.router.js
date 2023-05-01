import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { AdminPermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', productController.getPorductsController);
router.get('/:pId', productController.getProductByIdController);
router.post('/', AdminPermission ,productController.addProductController);
router.put('/:pId', AdminPermission ,productController.updateProductController);
router.delete('/:pId', AdminPermission, productController.deleteProductController);
router.post('/mockingproducts', productController.mockingProducts);

export default router