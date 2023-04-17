const {Router} = require("express");
const deck_controller = require("")
const middleWare = require("")

const deck_router = Router();
deck_router.use("")

deck_router.get("/",deck_controller)
deck_router.get("/:deck_id",deck_controller)