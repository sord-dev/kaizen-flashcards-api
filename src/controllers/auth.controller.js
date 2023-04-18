const User = require('../models/User.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        const user = await User.findByUsername(body.username);

        const validPw = await User.comparePassword(body.password, user.password);

        if (validPw) {
            // check user streak
            res.status(200).json({ ...user, password: null })
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
  
      return res.status(201).json({ ...usr, password: null });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
}