import productMongo from '../persistencia/DAOs/productsDAO/productsMongo.js';

class ProductService {
    constructor() {
        this.dao= productMongo;
    }
    async  getProductsService (lim,pag,qry,srt) {
        try {
            const options = {
                limit: lim,
                page: pag,
                query: qry,
                sort: srt
            }
            const listado =  await this.dao.getProducts(options)  
            return listado;
        } catch (error) {
            return error;
        }
    }
    
    async getProductsForHandleService (limit) {
        try {
            if (limit == '') {
                return await this.dao.getProductsForHandle();
            }else {
                return await this.dao.getProductsForHandlewLim(limit);
            }
        } catch (error) {
            return error;
        }
    }
    
    async  getProductByIdService(id) {
        try {
            const product = await this.dao.findOne(id);
            return product;
        } catch (error) {
            return error;
        }
    }
    
    async addProductService(obj) {
        try {
            const existingProduct = await this.dao.findByCode({ code: obj.code })
            if (existingProduct) return [];
            const newProduct = await this.dao.create(obj);
            return newProduct;
        } catch (error) {
            return error;
        }
    }
    
    async deleteProductService (id) {
        try {
            await this.dao.deleteOne(id);
            return true;
        } catch (error) {
            return error;
        }
    }
    
    async updateProductService (idProducto, obj) {
        const objUpdated = {_id: idProducto, ...obj};
        try {
            const updateProduct = await this.dao.updateOne(objUpdated);
            return updateProduct;  
        } catch (error) {
            return error;
        }
    }

}
const productService = new ProductService();
export default productService
