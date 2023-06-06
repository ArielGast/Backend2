import supertest from "supertest";
import { expect } from "chai";

const request = supertest('http://localhost:8080');

const productMock1 = {
    title: 'Prodcuto15',
    description: 'Descripción del producto15',
    code: 'NNN543',
    price: 845,
    status: true,
    stock: 20,
    category: '02',
};
const productMock2 = {
    title: 'Prodcuto test PUT',
    description: 'Descripción del producto test',
    code: 'EEE111',
    price: 100,
    status: true,
    stock: 15,
    category: '99',
};

const productMock3 = {
    title: 'Prodcuto test PUT',
    description: 'Descripción del producto test',
    code: 'EEE111',
    price: 100,
    status: true,
    stock: 20,
    category: '99',
}

const productMock4 = {
    title: 'Prodcuto test Delete',
    description: 'Descripción del producto test',
    code: 'EEE113',
    price: 1300,
    status: true,
    stock: 4,
    category: '99',
}
const IdTest = '63f3550fe3c654713aa81271'

describe('Test endpoint PRODUCTS', function (){
    it('Probando metodo GET de /api/products', async function () {
        const response = await request.get('/api/products');
        expect(response._body.respuesta).to.have.property('payload');
        expect(response.statusCode).to.be.equal(200);
        expect(response._body.respuesta.payload).to.be.an('array');
    })
    it('Probando metodo GET de /api/products/:id', async function () {
        const response = await request.get(`/api/products/${IdTest}`);
        expect(response._body).to.have.property('product');
        expect(response.status).to.be.equal(200);
        expect(response._body.product).to.have.property('code');
    })
    it('Probando metodo POST /api/products', async function () {
        const response = await request.post('/api/products').send(productMock1);
        expect(response.status).to.be.equal(200);
        expect(response._body).to.have.property('respuesta');
        expect(response._body.status).to.be.equal('Success');
    })
    it('Porbando ingresar producto con código repetido mentodo POST /api/product', async function () {
        const response = await request.post('/api/products').send(productMock1);
        expect(response.status).to.not.be.equal(200);

    })
    it('Probando metodo PUT con el filtro Admin /api/products/:id', async function () {
        //dejando el middleware AdminPermission en products.router.js
        const createdProduct = await request.post('/api/products').send(productMock2);
        const id = createdProduct._body.respuesta._id;
        const response = await request.put(`/api/products/${id}`).send(productMock3);
        expect(response.status).to.be.equal(403);
        expect(response._body.Message).to.be.equal('Forbiden');
        expect(response._body).to.not.have.property('respuesta');
    }) 
    it ('Probando el metodo DELETE con el filtro Admin /api/products/:id', async function () {
        const createdProduct = await request.post('/api/products').send(productMock4);
        const id = createdProduct._body.respuesta._id;
        const response = await request.delete(`/api/products/${id}`);
        expect(response.status).to.be.equal(403);
        expect(response._body.Message).to.be.equal('Forbiden');
        expect(response._body).to.not.have.property('respuesta');
    })

})