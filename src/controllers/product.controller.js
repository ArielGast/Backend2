import productService from "../services/product.services.js";

class ProductController {

    async getPorductsController (req,res) {
        try {
            const { limit=10, page=1, query, sort } = req.query;
        const productos = await productService.getProductsService(limit, page, query, sort);
        if (productos.docs.length == 0) {
            const respuesta = {
                status: 'error'
            }
                res.status(400).json({respuesta});        
        } else {
            const respuesta = {
                status: 'succes',
                payload: productos.docs,
                totalpages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage != false ? (`localhost:8080/api/products?page=${parseInt(page)-1}`): null,
                nextLink: productos.hasNextPage != false ? (`localhost:8080/api/products?page=${parseInt(page)+1}`): null
            }
            res.status(200).json({respuesta});
        } 
        } catch (error) {
            return res.status(500).json({error})
        }
    }
    
    async getProductsForPerfilController (req,res) {
        try {
            const {limit = 10, page = 1} = req.query;
            const products= await productService.getProductsService(limit, page);
            const listJson = JSON.parse(JSON.stringify(products.docs));
            return res.render('products', {email: req.session.email, role: req.session.role, listJson, products})
        } catch (error) {
            return res.status(500).json({error})
        }
    }
    
    async getProductsForHandleController (req, res) {
        try {
            const {limit = 10, page = 1} = req.query;
            const products= await productService.getProductsForHandleService(limit, page);
            const listJson = JSON.parse(JSON.stringify(products.docs));
            res.render('products', {listJson, products})
        } catch (error) {
            return res.status(500).json({error})
            
        }
    }
    
    async getProductByIdController(req,res) {
        try {
            const {pId} = req.params;
            const product = await productService.getProductByIdService(pId);
            if (product) {
                return res.status(200).json({product});
            }else {
                return res.status(400).json({status: 'error', message: 'Not Found'});
            }
        } catch (error) {
            return res.status(500).json({error});
        }
    }
    
    async addProductController(req,res) {
        try {
            let product = req.body;
            if (product.title === '' || product.description ==='' || product.code ==='' || product.price === '' || product.stock === '' || product.category === '') {
                return res.status(400).json({status:'Error', message: 'All data required'})   
            }
            const respuesta = await productService.addProductService(product);
            if ( respuesta.length == 0) {
                return res.status(400).json({status:'Error', message: 'Data repeated'})
            } else {
                return res.status(200).json({status: 'Success', message: 'Producto add successfully'}); 
            }        
        } catch (error) {
            return res.status(500).json({error});
    
        }
    }
    
    async updateProductController (req,res) {
        try {
            const {pId} = req.params;
            let newData = req.body;
            if (newData === '') {
                return res.status(400).send('Error. No data for update');
            }
            const response = await productService.updateProductService(pId,newData);
            return res.status(200).json({status: "Succes", message: 'Product updated'});        
        } catch (error) {
            return res.status(500).json({error});
    
        }
    }
    
    async deleteProductController(req,res) {
        try {
            const {pId} = req.params;
            const product = await productService.getProductByIdService(pId);
            if (!true) {
                return res.status(400).json({status:'Error' , message: 'No product in Data Base'})            
            }
            const response = await deleteProductService(pId)
            if (response === true) {
                return res.status(200).json({status: 'Succes', message: 'Product deleted'})
            } else {
                return res.status(400).json({status:'Error' , message: 'Error'})            
            }       
        } catch (error) {
            return res.status(500).json({error});
        }
    }

}


export default new ProductController()



