const User = require('../models/user.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        const user = await User.findByUsername(body.username);
        const validPw = await User.comparePassword(body.password, user.password);

        if (validPw) {
            // check user streak
            res.status(200).json({ ...user, password: null, Token: await token })
        } else {
            throw new Error('Incorrect Password')
        }
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}
module.exports.register = async (req, res) => {
    const { body } = req;
    try {
        const usr = new User({ username: body.username, password: body.password });

        // hash user password and save
        let hashed = await User.hashPassword(usr.password);
        usr.password = hashed;
        await usr.save();

        // create and assign user streak

        const user = await User.findByUsername(body.username)

        res.status(201).json({ ...user, password: null });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
module.exports.index = async (req, res) => {
    try {
        const resp = await User.getAll();
        res.json(resp);
    }
    catch (e) {
        res.json({ message: e.message })
    }
}
module.exports.addStats = async(req,res)=>{
    try{
        const user_id = parseInt (req.body.user_id);
        const resp = await User.AddMoreToAmount(req.body.amount,req.body.correct,user_id)
        res.json({Type:"Success"}).status(200)
    }
    catch(e){
        res.json({message : e.message}).status(404)
    }
}
module.exports.getUserStats = async(req,res)=>{
    try{
        const resp = await User.GetAllStatsByUser(parseInt(req.params.user_id))
        res.json(resp.rows[0]).status(200)
    }
    catch(e){
        res.json({message : e.message}).status(404)
    }
}