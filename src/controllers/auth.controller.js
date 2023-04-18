const User = require('../models/user.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        console.log("yes")
        const user = await User.findByUsername(body.username);

        const validPw = await User.comparePassword(body.password, user.password);
        const token = User.getToken(req.body.username)
        if (validPw) {
            // check user streak
            res.status(200).json({ ...user, password: null,Token:token })
        } else {
            throw new Error('Incorrect Password')
        }
    } catch (error) {
        res.status(401).json({ error: error.message })
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
        
        const userToken =await User.createUserToken()
        const user = await User.findByUsername(req.body.username)
        await User.addToken(userToken,user.user_id)
        
      return res.status(201).json({ ...usr, password: null,Token : userToken });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
}