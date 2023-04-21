const router = require('express').Router();
const authRouter = require('./auth.route.js')
const cardRouter = require("./card");
const deckRouter = require("./deck");
const userRouter = require("./user");

router.get('/', (_, res) => res.json(require('./docs/docs.json')))

router.use('/auth', authRouter)
router.use("/deck",deckRouter)
router.use("/card", cardRouter)
router.use("/user",userRouter)

module.exports = router;
