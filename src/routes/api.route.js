const router = require('express').Router();
const authRouter = require('./auth.route.js')

const Deck = require('../models/Deck.js')

router.get('/', (_, res) => res.json(require('./docs/docs.json')))

router.get('/deck', async (req, res, next) => {
    try {
        let decks = await Deck.getAll(1); // 1 being the first user_id in the database

        res.status(200).json(decks);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.use('/auth', authRouter)


module.exports = router;
