import {productsModel} from '../../mongoDB/models/products.model.js';
import BasicMongo from '../basicMongo.js';

class ProductMongo extends BasicMongo {
    constructor(model) {
        super(model)
    }
    async getProducts(obj){
        try {
            const listado =  await productsModel.paginate({},obj);      
            return listado
        }catch(error) {
            return error
        }

    }

    async getProductsForHandle() {
        try {
                return await productsModel.find().lean()
            
        }catch (error) {
            error;
        }
    }
    async getProductsForHandlewLim (lim) {
        try {
            return await productsModel.find().lean().limit(lim);  
        } catch (error) {
            return error
        }
    }

}

const productMongo = new ProductMongo(productsModel);
export default productMongo