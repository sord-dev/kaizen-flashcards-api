const Card = require("../models/card");
async function getAll(req,res){
    try{
        const id = parseInt(req.params.cardid)
        const resp = await Card.getById(id)
        res.status(200).json(resp);
    }
    catch{
        res.status(404)
        throw new Error ("unable to get all")
    }
}

const oneCardFromOneDeck = async(req,res)=>{
    try{
        const resp = await Card.getCardByDeck(parseInt(req.params.deckid),parseInt(req.params.cardid))
        res.status(200).json(resp);
    }
    catch{
        throw new Error("Unable to get one card from one deck")
    }
}
const NewCard = async(req,res) =>{
    try{
        const resp = await Card.createNew(req.body);
        res.json(resp).status(200);
    }
    catch{
        res.status(404)
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