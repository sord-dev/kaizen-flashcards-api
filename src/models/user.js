const db = require("../database/postgres.db.js");
const bcrypt = require("bcrypt");
const  uuid  = require("uuid");


class User {
  constructor({ user_id, username, password }) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
  }
  static async getAll(){
    try{
      const resp = await db.query("SELECT * FROM users")
      return resp.rows.map((e)=> new User(e))
    }
    catch{
      throw new Error("Unable to throw all")
    }
  }
  static async findTokenAndDelete(token){
    try{
      const token_id = await db.query("SELECT token_id FROM token WHERE Token = $1;",[token])
      const resp = await db.query("DELETE FROM token WHERE token_id = $1;",[token_id])
      return resp.rows.token_id;
    }
    catch{
      throw new Error("Unable to find token")
    }
  }
  static async getToken (username){
    try{
      console.log("in model",username)
      const user_id = await db.query("SELECT user_id from users WHERE username =$1;",[username])
      console.log(user_id.rows[0].user_id)
      const resp = await db.query("SELECT token FROM token WHERE user_id = $1;",[user_id.rows[0].user_id])
      return resp.rows[0].token;
    }
    catch{
      throw new Error ("Unable to find token")
    }
  }
  static async GetIDByName(username){
    try{
      const resp = await db.query("SELECT user_id FROM users WHERE username = $1;",[username])
      return resp.rows.user_id;
    }
    catch{
      throw new Error("Unable to get")
    }
  }
  static async addToken(token,user_id){
    try{
      const resp = await db.query("INSERT INTO Token(token,user_id) VALUES($1,$2);",[token,user_id])
    }
    catch(e){throw new Error (e)}
  }
  static async find() {
    let res = await db.query("SELECT * FROM users;");

    if (res.rowCount == 0) {
      throw new Error("query error");
    }

    return res.rows.map((u) => new User(u));
  }

  static async createUserToken(){
    return  (uuid.v4(5));
  }
  static async findByUsername(username) {
    const res = await db.query(
      "SELECT * FROM users WHERE LOWER(username) = $1;",
      [username.toLowerCase()]
    );

    if (res.rowCount == 0) {
      throw new Error("No user found.");
    }

    return new User(res.rows[0]);
  }

  static async findUserIdByToken (token) {
    try{
      const user_id = await db.query("SELECT user_id FROM token WHERE Token = $1",[token])
      return user_id.rows[0];
    }
    catch{
      throw new Error("Unable to find a user with that token")
    }
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
  static async comparePassword(query, compare) {
    let valid = await bcrypt.compare(query, compare);

    return valid;
  }
  static async CheckUserAccount(username,password){
    try{
      const answer = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2",[username,password])
      if (answer.rows.length == 0){
        return ("No Account")
      }
      throw new Error("Unable to check account")
    } 
    catch{
      throw new Error("Unable to check if user account exists")
    }
  }
  async save() {
    const resp = await db.query("INSERT INTO User_stats(amount,Correct) VALUES(0,0) RETURNING User_stats_id;")
    let response = await db.query(
      "INSERT INTO users (username, password,User_stats_id) VALUES ($1 ,$2,$3) RETURNING *;",
      [this.username, this.password,resp.rows[0].user_stats_id]
    );

    if (response.rowCount == 0) {
      throw new Error("Save Error");
    } else {
      return { message: "Created" };
    }
  }
  static async AddMoreToAmount(amount,correct,user_id){
  
    const user_stats_id = await db.query("SELECT User_stats_id FROM users WHERE user_id = $1",[user_id])
    const CurrentAmount = await db.query("SELECT amount FROM User_stats WHERE User_stats_id = $1",[user_stats_id.rows[0].user_stats_id]);
    const currentCorrect = await db.query("SELECT Correct FROM User_stats Where User_stats_id = $1",[user_stats_id.rows[0].user_stats_id]);
    const resp = await db.query("UPDATE User_stats SET amount=$1, Correct=$2 WHERE User_stats_id = $3 RETURNING *;",[CurrentAmount.rows[0].amount + parseInt(amount),currentCorrect.rows[0].correct + parseInt(correct),user_stats_id.rows[0].user_stats_id])
  }
  static async GetAllStatsByUser (user_id){
    const user_stats_id = await db.query("SELECT User_stats_id FROM users WHERE user_id = $1",[user_id])
    const resp = await db.query("SELECT * FROM User_stats WHERE User_stats_id = $1",[user_stats_id.rows[0].user_stats_id])
    return resp
  }
}

module.exports = User;
