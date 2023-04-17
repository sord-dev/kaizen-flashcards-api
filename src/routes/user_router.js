const {Router} = require("express");
const user_controller = require("")
const middleWare = require("")

const user_router = Router();

user_router.get("/login/:username&:password",user_controller.Login);
user_router.post("/register",user_controller.register);
user_router.delete("/remove", user_controller.remove)