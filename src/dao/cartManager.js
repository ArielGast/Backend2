import { cartsModel } from './models/carts.model.js';

export default class CartManager {

    async addCart () {
        try {
            const newCart = await cartsModel.create(cart);
            return newCart
            
        }catch (error) {
            return error;
        }
    }

    async findAllCarts () {
        try {
            const carts = await cartsModel.find()
            return carts
        } catch (error) {   
            return error
        }
    }

    async addToCart (obj, cart) {
        try {
            cart.products.push(obj)
            await cart.save()
            return
        }catch (error) {
            return error;
        }
    }

    async addToCartInc (idCar, idP) {
        try {
            await cartsModel.updateOne({idCart: idCar, "products.idProduct": idP}, {$inc: {"products.$.quantity": 1}});
            return 
        } catch (error) {
            return error
        }
    }

    async getCartById(idC) {
        try {
            const cart = cartsModel.findOne({idCart: idC});
                return cart
        }catch(error) {
             return error;   
        }
    }

    async deleteProductFromCart (idCar, idP) {
        try {
            await cartsModel.updateOne({idCart: idCar},{$pull:{products: {idProduct: idP }}});
            return
        } catch(error) {
            return error
        }
    }

    async updateCart (idCar, obj) {
        try {
            const updateCart = await cartsModel.updateOne({idCart: idCar}, {$set :{obj}});
            return updateCart
        }catch (error) {
            return error;
        }
    }

    async updateProductQty (idCar, idP, qty) {
        try {
            const updateQuantity = await cartsModel.updateOne({idCart: idCar, 'products.idProduct':idP}, {$set: {'products.$.quantity': qty}});
            return updateQuantity.modifiedCount
        }catch(error) {
            return error;
            
        }
    }

/*     async deleteAllProducts (idCar) {
        try {
            const cart = await this.getCartById(idCar);
            const productIds = cart.products.map(product => product.idProduct);
            productIds.forEach(p => {
                this.deleteProductFromCart(idCar, p)
            });
            return 'Succes' 
        } catch(error) {
            console.log(error)
        }
    } */
}