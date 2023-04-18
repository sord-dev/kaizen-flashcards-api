const db = require("../database/postgres.db.js");
const bcrypt = require("bcrypt");
import { nanoid } from "nanoid";

class User {
  constructor({ user_id, username, password }) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
  }
  static async findTokenAndDelete(token){
    try{
      const token_id = await db.query("SELECT token_id FROM token WHERE Token = $1;",[token])
      const resp = await db.query("DELETE FROM token WHERE token_id = $1;",[token_id])
      return resp;
    }
    catch{
      throw new Error("Unable to find token")
    }
  }
  static async getToken (username){
    try{
      const user_id = db.query("SELECT user_id from users WHERE username =$1;",[username])
      const resp = db.query("SELECT Token FROM token WHERE user_id = $1;",[user_id])
      return resp;
    }
    catch{
      throw new Error ("Unable to find token")
    }
  }
  static async GetIDByName(username){
    try{
      const resp = await db.query("SELECT user_id FROM users WHERE username = $1;",[username])
      return resp;
    }
    catch{
      throw new Error("Unable to get")
    }
  }
  async addToken(token){
    try{
      const resp = await db.query("INSERT INTO Token(token) VALUES($1);",[token])
      return hashed;
    }
    catch{throw new Error ("Unable to insert token")}
  }
  static async find() {
    let res = await db.query("SELECT * FROM users;");

    if (res.rowCount == 0) {
      throw new Error("query error");
    }

    return res.rows.map((u) => new User(u));
  }

  static async createUserToken(){
    return nanoid(5);

  }
  static async findByUsername(username) {
    let res = await db.query(
      "SELECT * FROM users WHERE LOWER(username) = $1;",
      [username.toLowerCase()]
    );

    if (res.rowCount == 0) {
      throw new Error("No user found.");
    }

    return new User(res.rows[0]);
  }

  static async findUserIdByToken (token){
    try{
      const user_id = await db.query("SELECT user_id FROM token WHERE Token = $1",[token])
      return user_id;
    }
    catch{
      throw new Error("Unable to find a user with that token")
    }
  }

  static async hashPassword(password) {

    const salt = await bcrypt.genSalt();
    let hashed = await bcrypt.hash(password, salt);

    try{
      const resp = await db.query("INSERT INTO Token(token) VALUES($1);",[hashed])
      return hashed;
    }
    catch{throw new Error ("Unable to hashpassword")}
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
      else ("Account exists")
    } 
    catch{
      throw new Error("Unable to check if user account exists")
    }
  }
  async save() {
    let response = await db.query(
      "INSERT INTO users (username, password) VALUES ($1 ,$2) RETURNING *",
      [this.username, this.password]
    );

    if (response.rowCount == 0) {
      throw new Error("Save Error");
    } else {
      return { message: "Created" };
    }
  }
}

module.exports = User;
