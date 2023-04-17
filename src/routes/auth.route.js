const router = require('express').Router();
const controller = require('../controllers/auth.controller.js')

router.post('/login', controller.login)

router.post('/register',controller.register)

module.exports = router;
