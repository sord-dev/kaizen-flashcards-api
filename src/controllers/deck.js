const Deck = require("../models/deck");
const Card = require("../models/card");

const allByID = async (req, res) => {
    console.log("AGGGGHHH ", req.body);
    try {
        const resp = await Deck.getAll(req.body.user_id);
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
        //const UserID = await User.GetIDByName(req.body.username)
        const resp = await Deck.save(req.body.name, req.body.user_id)

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