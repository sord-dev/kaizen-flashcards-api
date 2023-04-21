const {Router} = require("express");
const deck_controller = require("../controllers/deck")

const deck_router = Router();

deck_router.post("/", deck_controller.allByID)
deck_router.get("/:id",deck_controller.getDeckById)
deck_router.put("/:id",deck_controller.updateDeck)
deck_router.delete("/:id",deck_controller.remove)
deck_router.post("/new",deck_controller.createDeck)

module.exports = deck_router;