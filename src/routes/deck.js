const {Router} = require("express");
const deck_controller = require("../controller/deck")
const card_router = require("./card")

const deck_router = Router();

 deck_router.get("/")
 deck_router.get("/:deck_id")
deck_router.get("/:id",deck_controller.allByID)

module.exports = deck_router;