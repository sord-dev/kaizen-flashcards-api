const {Router} = require("express");
const card_controller = require("../controller/card")

const card_router = Router();

card_router.get("/")
card_router.get("/:cardid",card_controller.getAll)
card_router.post("/cards")
card_router.put("/:cardid")
card_router.delete("/:cardid")

module.exports = card_router;