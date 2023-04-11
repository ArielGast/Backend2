import {productsModel} from './models/products.model.js';

export default class ProductManager {

    async getProducts(obj) {
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

    async getProductById(idP) {
        try {
            const product = await productsModel.findOne({id:idP});
            return product
        }catch (error) {
            return error
        }
    }

    async addProduct(obj) {
        try {
            const newProduct = await productsModel.create(obj);
            return newProduct;
            }catch (error) {
                return error;
        }
    }   

    async deleteProduct (id) {
        try {
            await productsModel.deleteOne({_id: id});
            return true;
        }catch (error) {
            return error;
        }
    }
    
    async updateProduct (idProducto, obj) {
        try {
            const updateProduct = await productsModel.updateOne({ _id: idProducto}, {$set: { "title":obj.title, "description":obj.description, "code":obj.code, "price":obj.price, "status":obj.status, "stock":obj.stock, "category":obj.category, "thumbnail":obj.thumbnail} });
            return updateProduct;           
        }catch (error) {
           return error;
        }
    }


}