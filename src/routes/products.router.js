import { Router } from 'express';
import { getPorductsController, getProductByIdController,addProductController,updateProductController,deleteProductController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getPorductsController);
router.get('/:pId', getProductByIdController);
router.post('/', addProductController);
router.put('/:pId', updateProductController);
router.delete('/:pId', deleteProductController);

export default router