const {Router} = require("express");
const deck_controller = require("")
const card_router = require("./Card_router")
const middleWare = require("")

const deck_router = Router();
deck_router.use("/card",card_router)

deck_router.get("/",deck_controller)
deck_router.get("/:deck_id",deck_controller)