const User = require ("../models/user");

const Login = async(req,res)=>{
    try{
        const resp = await User.CheckUserAccount(req.params.username,req.params.password)
        const token = await User.getToken(req.params.username)
        res.json(token).status(202)
    }
    catch{
        res.status(404)
    }
}
const register = async(req,res)=>{
    try{
        const resp = await User.save(req.body.username,req.body.password);
        const token = await User.createUserToken();
        const sent = await User.addToken(token)
        res.json(token).status(201);
    }
    catch{
        res.status(409)
    }
}
const remove = async(req,res)=>{
    try{
        const userToken = req.headers["authorization"]
        const token = await User.findTokenAndDelete(userToken)
        res.status(200)
    }
    catch{
        res.status(404)
       throw new Error("Unable to delete token")
    }
}

module.exports = {
    Login,
    register,
    remove

}