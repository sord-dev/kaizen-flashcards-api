const router = require('express').Router();

const Deck = require('../models/Deck_model.js')

router.get('/', async (req, res, next) => {
  try {
    let decks = await Deck.getAll(1); // 1 being the first user_id in the database
    res.status(200).json(decks);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
