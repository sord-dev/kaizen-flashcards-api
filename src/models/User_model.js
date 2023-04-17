const db = require("../database/postgres.db.js");
const bcrypt = require("bcrypt");

class User {
  constructor({ user_id, username, password }) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
  }

  static async find() {
    let res = await db.query("SELECT * FROM users;");

    if (res.rowCount == 0) {
      throw new Error("query error");
    }

    return res.rows.map((u) => new User(u));
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
