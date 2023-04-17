const User = require ("../models/user");

const Login = async(req,res)=>{
    try{
        const resp = User.CheckUserAccount(req.params.username,req.params.password)
        const token = User.hashPassword(req.params.password)
        res.json(token).status(202)
    }
    catch{
        res.status(404)
    }
}
const register = async(req,res)=>{
    try{
        const resp = User.save(req.body.username,req.body.password);
        const token = User.hashPassword(req.params.password);
        res.json(token).status(201);
    }
    catch{
        res.status(409)
    }
}
const remove = async(req,res)=>{
    try{
        ///Token needed
    }
    catch{
        ///Add here
    }
}

module.exports = {
    Login,
    register,
    remove

}