import ProductManager from '../dao/productManager.js'

const productManager = new ProductManager();


export async function getProductsService (lim,pag,qry,srt) {
    try {
        const options = {
            limit: lim,
            page: pag,
            query: qry,
            sort: srt
        }
        const listado =  await productManager.getProducts(options)  
        return listado;
    } catch (error) {
        return error;
    }
}

export async function getProductsForHandleService (limit) {
    try {
        if (limit == '') {
            return await productManager.getProductsForHandle();
        }else {
            return await productManager.getProductsForHandlewLim(limit);
        }
    } catch (error) {
        return error;
    }
}

export async function getProductByIdService(id) {
    try {
        const product = await productManager.getProductById(id);
        return true;
    } catch (error) {
        return error;
    }
}

export async function addProductService(obj) {
    try {
        const newProduct = await productManager.addProduct(obj);
        return newProduct;
    } catch (error) {
        return error;
    }
}

export async function deleteProductService (id) {
    try {
        await productManager.deleteProduct(id);
        return true;
    } catch (error) {
        return error;
    }
}

export async function updateProductService (id, obj) {
    try {
        const updateProduct = await productManager.updateProduct(id, obj);
        return updateProduct;  
    } catch (error) {
        return error;
    }
}