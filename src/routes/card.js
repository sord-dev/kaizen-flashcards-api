const {Router} = require("express");
const card_controller = require("../controller/card")

const card_router = Router();

card_router.get("/",(req,res) =>{res.send("Card")})
card_router.get("/:cardid",card_controller.getAll)
card_router.get("/getbydeck/:deckid:cardid",card_controller.oneCardFromOneDeck)
card_router.post("/card",card_controller.NewCard)
card_router.put("/:cardid",card_controller.updateCard)
card_router.delete("/:cardid",card_controller.remove)

module.exports = card_router;