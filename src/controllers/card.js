const Card = require("../models/card");
const User = require("../models/user");
const Deck = require("../models/deck")

async function getAll(req, res) {
    try {
        const id = parseInt(req.params.deck_id)
        const resp = await Card.getByDeckId(id)
        res.status(200).json(resp);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
}

const oneCardFromOneDeck = async (req, res) => {
    try {
        const resp = await Card.getByDeckId(parseInt(req.params.deck_id))

        res.status(200).json(resp);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const NewCard = async (req, res) => {
    try {
        const resp = await Card.saveToDeck(req.body, parseInt(req.params.deck_id));
        console.log("After create");
        res.status(201).json(resp);
    }
    catch (e) {
        res.status(404).json({ message: e.message })
    }
}
const updateCard = async (req, res) => {
    try {
       // const updatingCard = await Card.getCardByDeck(parseInt(req.params.card_id), parseInt(req.params.deck_id));
        const resp = await Card.changeContent(req.body,req.params.card_id);
        res.status(200).json(resp)
    }
    catch(e) {
        console.log(e);
        res.status(404).json({ message: e.message })
    }
}
const remove = async (req, res) => {
    try {
        // returning array rather than single object
        const RemovingContent = await Card.getById(parseInt(req.params.card_id));
        const resp = await RemovingContent.Destroy()

        res.status(200).json(resp)
    }
    catch(e) {
        console.log(e);
        res.status(404).json({ message: e.message })
    }
}
module.exports = {
    getAll,
    oneCardFromOneDeck,
    NewCard,
    updateCard,
    remove
}