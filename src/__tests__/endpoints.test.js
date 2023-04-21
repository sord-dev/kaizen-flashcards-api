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

    it('Should create a user on POST request to /auth/register with correct credentials', async () => {
        const response = await server.post('/auth/register').send({ username: "admin2", password: "admin" });

        expect(response.statusCode).toEqual(201)
        expect(typeof response.body.username).toEqual("string")
    });

    it('Should reject POST request to /auth/register with incorrect credentials', async () => {
        const response = await server.post('/auth/register').send({ usr: "admin2", passwod: "admin" });

        expect(response.statusCode).toEqual(400)
    });

    it('Should login existing user on POST request to /auth/login with correct credentials', async () => {
        const response = await server.post('/auth/login').send({ username: "admin", password: "admin" });

        expect(response.statusCode).toEqual(200)
        expect(typeof response.body.username).toEqual("string")
    });

    it('Should reject request to POST /auth/login with incorrect credentials (wrong username)', async () => {
        const response = await server.post('/auth/login').send({ username: "admi", password: "admin" });

        expect(response.statusCode).toEqual(401)
    });

    it('Should reject request to POST /auth/login with incorrect credentials (wrong password)', async () => {
        const response = await server.post('/auth/login').send({ username: "admin", password: "admi" });

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

    it('Should respond with all decks on request to /decks', async () => {
        const decks = await server.post('/deck').send({user_id: 1})
        expect(decks.statusCode).toEqual(200)
        expect(Array.isArray(decks.body)).toEqual(true);
    });

    it('Should respond with specific deck on request to /decks/:deck_id', async () => {
        const decks = await server.get('/deck/1')

        expect(decks.statusCode).toEqual(200)
        expect(typeof(decks.body)).toEqual("object");
    });
    it('Should create new deck', async () => {
        const response = await server.post('/deck/new').send({ name: "test deck", user_id : 1 });
        const user_id = parseInt(response.text)

        expect(response.statusCode).toEqual(201)
        expect(typeof user_id).toBe("number")
    })
    it('Should update an existing deck by ID', async () => {
        const response = await server.put('/deck/1').send({ name: "updated deck" });

        expect(response.statusCode).toEqual(200)
        expect(response.body.name).toEqual("updated deck")
    })
    it ('Should delete a specific deck by ID', async () => {
        const response = await server.delete('/deck/1');

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
        const cards = await server.get('/card/1')

        expect(cards.statusCode).toEqual(200)
        expect(Array.isArray(cards.body)).toEqual(true);
    })
    it('Should respond with specific card on request to /card/getbydeck/:cardid', async () => {
        const cards = await server.get('/card/getbydeck/1')

        expect(cards.statusCode).toEqual(200)
        expect(Array.isArray(cards.body)).toEqual(true)
    })
    
    it('Should create new card POST /card/:deck_id', async () => {
        const response = await server.post('/card/1').send({ question: "test card", description: "klhasdfj", answer: "yes" });

        expect(response.statusCode).toEqual(201)
        expect(typeof response.body.card_id).toBe('number');
    })

    it('Should update an existing card by ID', async () => {
        const response = await server.put('/card/1/1').send({ question: "test card edited", description: "klhasdfj", answer: "yes" });

        expect(response.statusCode).toEqual(200)
        expect(typeof response.body.question).toEqual("string")
    }, 6000)

    it ('Should delete a specific card by ID', async () => {
        const response = await server.delete('/card/1');

        expect(response.statusCode).toEqual(200)
    })

})