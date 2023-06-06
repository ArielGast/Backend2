import supertest from "supertest";
import { expect } from "chai";

const userTest = {
    email: 'test@mail.com',
    password: 'pepe'
};

const request = supertest('http://localhost:8080');

describe('Test endpoint SESSION', function () {
    it('Probando metodo GET /api/sessions/current', async function () {
        const response = await request.get('/api/sessions/current');
        expect(response.statusCode).to.be.equal(200);
        expect(response.text).to.not.have.lengthOf(0);
        })
})

describe('Test endpoint USERS', function () {
    it('Probando metodo POST /users/login', async function () {
        const response = await request.post('/users/login').send(userTest);
        expect(response.statusCode).to.be.equal(302);
        expect(response.headers).to.have.property('vary');
    })
    it('Probando metodo POST /users/reset', async function () {
        const response = await request.post('/users/reset').send(userTest);
        expect(response).to.have.property('_body');
        expect(response._body.message).to.be.equal('Mail Send');
        expect(response.statusCode).to.be.equal(200)
    })

})