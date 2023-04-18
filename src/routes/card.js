const {Router} = require("express");
const card_controller = require("../controllers/card")

const card_router = Router();

// card_router.get("/",(req,res) =>{res.send("Card")})
card_router.get("/:card_id", card_controller.getAll)

card_router.get("/getbydeck/:deck_id",card_controller.oneCardFromOneDeck)

card_router.post("/:deck_id",card_controller.NewCard)

card_router.put("/:card_id/:deck_id", card_controller.updateCard)

card_router.delete("/:card_id",card_controller.remove)

module.exports = card_router;