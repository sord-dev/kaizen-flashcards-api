const Deck = require("../models/deck");
const Card = require("../models/card");
const User = require("../models/user");

const allByID = async (req, res) => {
    try {
        const user_id = await User.findUserIdByToken(req.headers['authorization'])
        console.log(user_id)
        const resp = await Deck.getAll(parseInt(user_id.user_id));
        res.status(200).json(resp);
    }
    catch (e) {
        res.status(404).json({ message: e.message })
    }
}

const getDeckById = async (req, res) => { // now returns deck and cards to deck
    try {
        const id = parseInt(req.params.id);
        const deck = await Deck.getById(id);
        const deckCards = await Card.getByDeckId(id);
        res.status(200).json({ ...deck, cards: deckCards });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const createDeck = async (req, res) => {
    try {
        const user_id = await User.findUserIdByToken(req.headers['authorization'])
    
        const resp = await Deck.save(req.body.name, user_id)

        res.status(201).json(resp)
    }
    catch (e) {
        res.status(400).json({ message: e.message })
    }
}

const updateDeck = async (req, res) => {
    try {
        const deckID = await Deck.getById(parseInt(req.params.id));
        const resp = await deckID.update(req.body);
        res.status(200).json(resp)
    }
    catch (e) {
        res.status(404).json({ message: e.message })
    }
}

const remove = async (req, res) => {
    try {
        const deckID = await Deck.getById(parseInt(req.params.id));
        const removing = await deckID.destroy()

        res.status(200).json({ deleted: removing })
    }
    catch (e) {
        console.log(e.message);
        res.status(400).json({ message: e.message })
    }
}

module.exports = {
    allByID,
    createDeck,
    updateDeck,
    remove,
    getDeckById
}