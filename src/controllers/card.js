const Card = require("../models/card");
const User = require("../models/user");
const Deck = require ("../models/deck")

async function getAll(req,res){
    try{
        const id = parseInt(req.params.card_id)
        const resp = await Card.getByDeckId(id)
        res.status(200).json(resp);
    }
    catch(error) {
        console.log(error);
        res.status(404).json({ message: error.message  })
    }
}

const oneCardFromOneDeck = async(req,res)=>{
    try{
        const resp = await Card.getByDeckId(parseInt(req.params.deckid))
        res.status(200).json(resp);
    }
    catch{
        throw new Error("Unable to get one card from one deck")
    }
}
const NewCard = async(req,res) =>{
    try{
             const resp = await Card.saveToDeck(req.body,parseInt(req.params.id));
             console.log("After create");
             res.json(resp).status(201);
    }
    catch(e){
        res.status(404).json({message : e.message})
    }
}
const updateCard = async(req,res) =>{
    try{
        const updatingCard = await Card.getById(parseInt(req.params.cardid));
        const resp = await updatingCard.updateCard(req.body);
        res.status(200).status(resp)
    }
    catch{
        throw new Error("unable to update")
    }
}
const remove = async(req,res) =>{
    try{
        const RemovingContent = await Card.getById(parseInt(req.params.cardid));
        const resp = RemovingContent.Destroy()
        res.status(200)
    }
    catch{
        throw new Error("Unable to remove")
    }
}
module.exports = {
    getAll,
    oneCardFromOneDeck,
    NewCard,
    updateCard,
    remove
}