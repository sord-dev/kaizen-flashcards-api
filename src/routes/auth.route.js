const router = require('express').Router();
const controller = require('../controllers/auth.controller.js')

router.post('/login', controller.login)
router.get("/users", controller.index)
router.post('/register',controller.register)
router.put("/stats",controller.addStats)
router.get("/stats/:user_id",controller.getUserStats)
module.exports = router;
