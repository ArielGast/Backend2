import { Router } from 'express';
import productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getPorductsController);
router.get('/:pId', productController.getProductByIdController);
router.post('/', productController.addProductController);
router.put('/:pId', productController.updateProductController);
router.delete('/:pId', productController.deleteProductController);

export default router