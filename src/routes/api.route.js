const router = require('express').Router();
const authRouter = require('./auth.route.js')

const Deck = require('../models/Deck.js')

router.use('/auth', authRouter)

router.get('/decks', async (req, res, next) => {
  try {
    let decks = await Deck.getAll(1); // 1 being the first user_id in the database

    res.status(200).json(decks);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



module.exports = router;
