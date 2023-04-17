const Deck = require("../models/Deck_model");
const User = require("../models/User_model");

const allByID = async(req,res)=>{
    try{
        const resp = Deck.getById(parseInt(req.params.id));
        res.json(resp).status(200)
    }
    catch{
        res.status(404)
        throw new Error("unable to get by id")
    }
}
const createDeck = async(req,res)=>{
    try{
        const UserID = User.GetIDByName(req.body.username)
        const resp = Deck.newDeck(req.body.deckname,UserID)
    }
    catch{
        throw new Error("Unable to create a new deck")
    }
}
const nameChange =async(req,res)=>{
    try{
        const deckID = await Deck.getById(parseInt(red.params.id));
        const resp = deckID.nameChange(req.body);
        res.status(200).json(resp)
    }
    catch{
        throw new Error("Unable to update")
    }
}
const remove = async(req,res)=>{
    try{
        const deckID = await Deck.getById(parseInt(req.params.id));
        const removing = await deckID.remove()
        res.status(202)
    }
    catch{
        res.status(404)
        throw new Error("Unable to remove")
    }
}
module.exports = {
    allByID,
    createDeck,
    nameChange,
    remove
}