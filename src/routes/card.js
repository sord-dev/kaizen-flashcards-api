const {Router} = require("express");
const card_controller = require("../Controller/card")
const middleWare = require("")

const card_router = Router();

card_router.get("/",card_controller)
card_router.get("/:cardid",card_controller)
card_router.post("/cards",card_controller)
card_router.put("/:cardid",card_controller)
card_router.delete("/:cardid",card_controller)
