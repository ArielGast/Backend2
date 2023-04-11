import CartManager from "../dao/cartManager.js";


const cartManager = new CartManager();

export async function addCartService () {
    try {
        const searchcart = await cartManager.findAllCarts();
        if (searchcart.length === 0) {
            const cart = {
                idCart: 1,
                products: []
            }
            const newCart = await cartManager.addCart(cart);
            return newCart;
        } else {
            const cart = {
                idCart: searchcart[searchcart.length -1].idCart + 1,
                products: [],
            }
            const newCart = await cartManager.addCart(cart);
            return newCart
        }
        
    } catch (error) {
        return error
    }
}

export async function addToCartService(idCar, idP) {
    try {
        const searchCart = await cartManager.getCartById(idCar);
        const findProduct = searchCart.products.findIndex(p => p.idProduct == idP);
        if (findProduct === -1) {
            const obj = {
                idProduct: idP,
                quantity:1
            }
            cartManager.addToCart(obj, searchCart)
        }else {
            await cartManager.addToCartInc(idCar, idP);
            }
        return
    } catch (error) {
        return error
    }

}

export async function getCartByIdService (idC) {
    try {
        const cart = cartManager.getCartById(idC)
        return cart
    } catch (error) {
        return error
    }
}
 

export async function deleteProductFromCartService (idCar, idP) {
    try {
        let response;
            const searchCart = await cartManager.getCartById(idCar);
            const findProduct = searchCart.products.findIndex(p => p.idProduct == idP);
            if (findProduct === -1) {
                response = 'Error';
                return response;
            } else {
               await cartManager.deleteProductFromCart(idCar, idP)
                response = 'Succes';
                return response
            }       
    } catch (error) {
        return error
    }
}

export async function updateCartService (idCar, obj) {
    try {
        const updateCart = await cartManager.updateCart(idCar, obj);
        return updateCart
    } catch (error) {
        return error
    }
}

export async function updateProductQtyService (idCar, idP, qty) {
    try {
        const updateQuantity = await cartManager.updateQuantity(idCar, idP, qty)
        return updateQuantity
    } catch (error) {
        return error
    }
}

export async function deleteAllProductsService (idCar) {
    try {
        const cart = await getCartByIdService(idCar);
        const productIds = cart.products.map(product => product.idProduct);
        productIds.forEach(p => {
            deleteProductFromCartService(idCar, p)
        });
        return 'Succes'  
    } catch (error) {
        return error
    }
}