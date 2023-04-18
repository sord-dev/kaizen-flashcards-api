const db = require("../database/postgres.db.js");
const bcrypt = require("bcrypt");
const { uuid } = require("uuid");


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

  static async createUserToken() {
    return uuid(5);
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
    return hashed;
  }
  static async comparePassword(query, compare) {
    let valid = await bcrypt.compare(query, compare);

    return valid;
  }

  async save() {
    let response = await db.query(
      "INSERT INTO users (username, password) VALUES ($1 ,$2) RETURNING *",
      [this.username, this.password]
    );

    if (response.rowCount == 0) {
      throw new Error("Save Error");
    } else {
      return new User(response.rows[0]);
    }
  }
}

module.exports = User;
