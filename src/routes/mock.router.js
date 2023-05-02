import { Router } from 'express';
import { generateProducts } from '../utils.js';

const router = Router();

router.get('/', async(req, res) => {
    let products = [];
        try {
            for (let i = 0;i<100; i++) {
                const product = await generateProducts();
                products.push(product);
            } 
            res.json(products)
        }catch (error) {
            return res.status(500).json({error})
            
        }
})

export default router
