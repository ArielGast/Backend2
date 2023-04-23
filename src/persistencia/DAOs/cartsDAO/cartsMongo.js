import { cartsModel } from '../../mongoDB/models/carts.model.js';
import BasicMongo from '../basicMongo.js';

class CartMongo extends BasicMongo {
    constructor(model){
        super(model)
    }
    async addToCart (obj, cart) {
        try {
            cart.products.push(obj);
            await cart.save();
            return cart;
        } catch (error) {
            return error;
        }
    }
}

const cartMongo = new CartMongo(cartsModel)
export default cartMongo