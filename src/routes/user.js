const { Router } = require("express");
const user_controller = require("../controllers/auth.controller")

const user_router = Router();

user_router.get("/login", user_controller.login);
user_router.post("/register", user_controller.register);
user_router.get("/users", user_controller.index)
module.exports = user_router;