import supertest from "supertest";
import { expect } from "chai";


const request = supertest('http://localhost:8080');
const idTest = 2;


describe('Test endpoint CARTS', function () {
    it('Probando metodo GET de /api/carts/:id', async function () {
        const response = await request.get(`/api/carts/${idTest}`);
        expect(response.status).to.be.equal(200);
        expect(response._body.messages).to.be.equal('Carts found');
        expect(response._body.cart).to.have.property('_id');
    })
    it('Probando metodo POST de /api/carts', async function () {
        const response = await request.post('/api/carts');
        expect(response.status).to.be.equal(200);
        expect(response).to.have.property('_body');
        expect(response._body.status).to.be.equal('Succes');
    })
    it('Probando metodo PUT de /api/carts/:id', async function() {
        const response = await request.put(`/api/carts/${idTest}`);
        expect(response.status).to.be.equal(200);
        expect(response._body.request.products).to.have.lengthOf(0);
        expect(response._body.message).to.be.equal('Cart updated');
    })

})