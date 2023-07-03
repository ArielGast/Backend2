import cartMongo from "../persistencia/DAOs/cartsDAO/cartsMongo.js";

class CartService {
    constructor() {
        this.dao = cartMongo;
    }

    async addCartService () {
        try {
            const searchcart = await this.dao.findAll();
            if (searchcart.length === 0) {
                const cart = {
                    idCart: 1,
                    products: []
                }
                const newCart = await this.dao.create(cart);
                return newCart;
            } else {
                const cart = {
                    idCart: searchcart[searchcart.length -1].idCart + 1,
                    products: [],
                }
                const newCart = await this.dao.create(cart);
                return newCart
            }
            
        } catch (error) {
            return error
        }
    }
    
    async addToCartService(idCar, idP) {
        try {
            const searchCart = await this.dao.findByCustomId(idCar);
            const findProduct = searchCart.products.findIndex(p => p.idProduct == idP);
            if (findProduct === -1) {
                const obj = {
                    idProduct: idP,
                    quantity:1
                }
                this.dao.addToCart(obj, searchCart)
            }else {    
                await this.dao.updateOne({idCart: idCar, "products.idProduct": idP}, {$inc: {"products.$.quantity": 1}});
                }
            return
        } catch (error) {
            return error
        }
    
    }
    
    async getCartByIdService (idC) {
        try {
            const cart = this.dao.findByCustomId(idC)
            return cart
        } catch (error) {
            return error
        }
    }
     
    
    async deleteProductFromCartService (idCar, idP) {
        const idCarInt = parseInt(idCar);
        try {
            let response;
                const searchCart = await this.dao.findByCustomId(idCar);
                const findProduct = searchCart.products.findIndex(p => p.idProduct == idP);
                if (findProduct === -1) {
                    response = 'Error';
                    return response;
                } else {
                    const objUpdated = {idCart: idCarInt, products:[]};
                    await this.dao.updateOne(objUpdated);
                    response = 'Succes';
                    return response
                }       
        } catch (error) {
            return error
        }
    }
    
    async updateCartService (idCar, obj) {
        try {
            await this.dao.updateOne({idCart: idCar}, {$set :{obj}});
            const updateCart = await this.dao.findByCustomId(idCar)
            return updateCart
        } catch (error) {
            return error
        }
    }
    
    async updateProductQtyService (idCar, idP, qty) {
        try {
            const updateQuantity = await this.dao.updateOne({idCart: idCar, 'products.idProduct':idP}, {$set: {'products.$.quantity': qty}})
            return updateQuantity
        } catch (error) {
            return error
        }
    }
    
    async deleteAllProductsService (idCar) {
        try {
            const cart = await this.dao.findByCustomId(idCar);
            const productIds = cart.products.map(product => product.idProduct);
            productIds.forEach(p => {
                this.deleteProductFromCartService(idCar, p)
                
            });
            return 'Succes'  
        } catch (error) {
            return error
        }
    }
}
const cartService = new CartService();
export default cartService;


