const { createDbEnv, populateDbEnv, destroyDbEnv } = require('../database/setup-test-db.js')

const request = require('supertest');
const app = require('../app.js')
const server = request(app)

describe("Auth Endpoint Tests", () => {
    beforeEach(async () => {
        await createDbEnv()
        await populateDbEnv()
    })

    afterEach(async () => {
        await destroyDbEnv()
    })

    it('Should create a user on POST request to /api/auth/register with correct credentials', async () => {
        const response = await server.post('/api/auth/register').send({ username: "admin2", password: "admin" });

        expect(response.statusCode).toEqual(201)
        expect(typeof response.body.username).toEqual("string")
    });

    it('Should reject POST request to /api/auth/register with incorrect credentials', async () => {
        const response = await server.post('/api/auth/register').send({ usr: "admin2", passwod: "admin" });

        expect(response.statusCode).toEqual(400)
    });

    it('Should login existing user on POST request to /api/auth/login with correct credentials', async () => {
        const response = await server.post('/api/auth/login').send({ username: "admin", password: "admin" });

        expect(response.statusCode).toEqual(200)
        expect(typeof response.body.username).toEqual("string")
    });

    it('Should reject request to POST /api/auth/login with incorrect credentials (wrong username)', async () => {
        const response = await server.post('/api/auth/login').send({ username: "admi", password: "admin" });

        expect(response.statusCode).toEqual(401)
    });

    it('Should reject request to POST /api/auth/login with incorrect credentials (wrong password)', async () => {
        const response = await server.post('/api/auth/login').send({ username: "admin", password: "admi" });

        expect(response.statusCode).toEqual(401)
    });
    
})

describe("Deck Endpoint Tests", () => {
    beforeEach(async () => {
        await createDbEnv()
        await populateDbEnv()
    })

    afterEach(async () => {
        await destroyDbEnv()
    })

    it('Should respond with all decks on request to /api/decks', async () => {
        const decks = await server.get('/api/decks')

        expect(decks.statusCode).toEqual(200)
        expect(Array.isArray(decks.body)).toEqual(true);
    });

    it('Should respond with specific deck on request to /api/decks/:deck_id', async () => {
        const decks = await server.get('/api/decks/1')

        expect(decks.statusCode).toEqual(200)
        expect(Array.isArray(decks.body)).toEqual(true);
    });
    it('Should create new deck', async () => {
        const response = await server.post('/api/decks').send({ name: "test deck" });

        expect(response.statusCode).toEqual(201)
        expect(response.body.name).toEqual("test deck")
    })
    it('Should update an existing deck by ID', async () => {
        const response = await server.put('/api/decks/1').send({ name: "updated deck" });

        expect(response.statusCode).toEqual(200)
        expect(response.body.name).toEqual("updated deck")
    })
    it ('Should delete a specific deck by ID', async () => {
        const response = await server.delete('/api/decks/1');

        expect(response.statusCode).toEqual(200)
    })
})

describe("Card Endpoint Tests", () => {
    beforeEach(async () => {
        await createDbEnv()
        await populateDbEnv()
    })

    afterEach(async () => {
        await destroyDbEnv()
    })
    it('Should respond with all cards on request to /decks/:deckId/cards', async () => {
        const cards = await server.get('/decks/:deckId/cards')

        expect(cards.statusCode).toEqual(200)
        expect(Array.isArray(cards.body)).toEqual(true);
    })
    it('Should respond with specific card on request to /decks/:deckId/cards/:card_id', async () => {
        const cards = await server.get('/decks/:deckId/cards/1')

        expect(cards.statusCode).toEqual(200)
        expect(Array.isArray(cards.body)).toEqual(true);
    })
    it('Should create new card', async () => {
        const response = await server.post('/decks/:deckId/cards').send({ name: "test card" });

        expect(response.statusCode).toEqual(201)
        expect(response.body.name).toEqual("test card")
    })
    it('Should update an existing card by ID', async () => {
        const response = await server.put('/decks/:deckId/cards/1').send({ name: "updated card" });

        expect(response.statusCode).toEqual(200)
        expect(response.body.name).toEqual("updated card")
    })
    it ('Should delete a specific card by ID', async () => {
        const response = await server.delete('/decks/:deckId/cards/1');

        expect(response.statusCode).toEqual(200)
        
    })

})