const User = require('../models/user.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        const user = await User.findByUsername(body.username);
        const validPw = await User.comparePassword(body.password, user.password);
        console.log(body.username)
        const token = await User.getToken(body.username)
   

        if (validPw) {
            // check user streak
            res.status(200).json({ ...user, password: null,Token: await token })
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
        
        const userToken =await User.createUserToken()
        const user = await User.findByUsername(body.username)
        console.log("Add token", userToken)
        console.log("User", user)
        
        await User.addToken(userToken,user.user_id)
        console.log("NO ERRORS", userToken)
          res.status(201).json({ ...usr, password: null,Token : userToken });
    } catch (error) {
        return  res.status(400).json({ error: error.message });
    }
}
module.exports.index = async(req,res) =>{
    try{
        const resp = await User.getAll();
        res.json(resp);
    }
    catch(e){
        res.json({message : e.message})
    }
}