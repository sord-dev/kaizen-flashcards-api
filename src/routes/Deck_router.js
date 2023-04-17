const {Router} = require("express");
const deck_controller = require("")
const middleWare = require("")

const deck_router = Router();

deck_router.get("/",deck_controller)
deck_router.get("")