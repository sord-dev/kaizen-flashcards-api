const User = require('../models/user.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        const user = await User.findByUsername(body.username);

        const validPw = await User.comparePassword(body.password, user.password);
        const token = User.createUserToken()
        User.addToken(token)
        if (validPw) {
            // check user streak
            res.status(200).json({ ...user, password: null,token:token })
        } else {
            throw new Error('Incorrect Password')
        }
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}
module.exports.register = async (req, res) => {
    const { body } = req;
    const token = User.getToken(username)
    try {
      const usr = new User({ username: body.username, password: body.password });
  
      // hash user password and save
      let hashed = await User.hashPassword(usr.password);
      usr.password = hashed;
      await usr.save();

      // create and assign user streak
  
      return res.status(201).json({ ...usr, password: null,token : token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
}