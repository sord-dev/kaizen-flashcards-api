const Deck = require("../models/deck");
const User = require("../models/user");

const allByID = async(req,res)=>{
    try{
      const userToken = req.headers["authorization"]
      const user_id = User.findUserIdByToken(userToken);
      const resp = Deck.getAll(parseInt(user_id));
      res.json(resp).status(200);
    }
    catch(e){
        res.status(404).json({message: e.message})
    }
}

const getDeckById = async (req, res) => {
    try {
        const id = parseInt (req.params.id);
        const resp = await Deck.getById(id);
        res.json(resp).status(200);
    } catch (error) {
        res.status(404).json({message: e.message})
    }
}

const createDeck = async(req,res)=>{
    try{
        //const UserID = await User.GetIDByName(req.body.username)
        const resp = await Deck.save(req.body.name, req.body.user_id)

        res.status(201).json(resp)
    }
    catch (e){
       res.status(400).json({message:e.message})
    }
}

const nameChange =async(req,res)=>{
    try{
        const deckID = await Deck.getById(parseInt(req.params.id));
        const resp =await  deckID.update(req.body);
        res.status(200).json(resp)
    }
    catch(e){
        res.status(404).json({message:e.message})
    }
}

const remove = async(req,res)=>{
    try{
        const deckID = await Deck.getById(parseInt(req.params.id));
        const removing = await deckID.destroy()
        console.log(removing)

        res.status(200).json({deleted: removing })
    }
    catch(e){
        console.log(e.message);
        res.status(400).json({ message: e.message })
    }
}

module.exports = {
    allByID,
    createDeck,
    nameChange,
    remove,
    getDeckById
}