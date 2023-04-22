const db = require("../database/postgres.db.js");
const bcrypt = require("bcrypt");
const StreakCounter = require("../lib/streakCounter.js");

class User {
  constructor({ user_id, username, password, streak, last_hit, user_stats_id }) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
    this.streak = streak;
    this.last_hit = last_hit;
    this.user_stats_id = user_stats_id;
  }

  static async getAll() {
    try {
      const resp = await db.query("SELECT * FROM users")
      return resp.rows.map((e) => new User(e))
    }
    catch {
      throw new Error("Unable to throw all")
    }
  }

  static async findById(user_id) {
    const resp = await db.query("SELECT * FROM users WHERE user_id = $1;", [user_id])

    if(!resp.rowCount) throw new Error('Unable to find user.')

    return new User(resp.rows[0]);
  }

  static async findByUsername(username) {
    let res = await db.query("SELECT * FROM users WHERE LOWER(username) = LOWER($1);", [username]);

    if (res.rowCount == 0) {
      throw new Error("query error");
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
    const userStatistics = await db.query("INSERT INTO user_stats(amount, correct) VALUES(0,0) RETURNING user_stats_id;") // create user statistic 

    let response = await db.query(
      "INSERT INTO users (username, password, streak, user_stats_id) VALUES ($1 ,$2, $3, $4) RETURNING *;",
      [this.username, this.password, this.streak, userStatistics.rows[0].user_stats_id]
    ); // create user and associate user statistic + provided streak values

    if (response.rowCount == 0) {
      throw new Error("Save Error");
    } else {
      return { message: "Created" };
    }
  }

  async updateStreak(streak) {
    const response = await db.query("UPDATE users SET streak=$1 WHERE user_id = $2 RETURNING *;", [streak, this.user_id]);

    if (!response.rowCount) throw new Error('Update Error');

    let user = new User(response.rows[0]);

    user.streak = new StreakCounter(user.streak);
    return user;
  }

  async updateStats(amount, correct) { 
    // get current user stats
    const response = await db.query("SELECT amount, correct FROM user_stats WHERE user_stats_id = $1", [this.user_stats_id]);
    if (!response.rowCount) throw new Error('Update Error');
    let currentAmount = response.rows[0];

    // append stats gained
    let newAmount = currentAmount.amount + parseInt(amount)
    let newCorrect = currentAmount.correct + parseInt(correct)

    const resp = await db.query("UPDATE user_stats SET amount=$1, correct=$2 WHERE user_stats_id = $3 RETURNING *;", [newAmount, newCorrect, this.user_stats_id])

    return resp.rows[0];
  }

  static async getUserStats(user_id) { 
    const response = await db.query("SELECT user_stats_id FROM users WHERE user_id = $1", [user_id])

    if (!response.rowCount) throw new Error('Error finding user.');

    const user_stats_id = response.rows[0].user_stats_id;

    const resp = await db.query("SELECT * FROM user_stats WHERE user_stats_id = $1", [user_stats_id])

    return resp
  }
}

module.exports = User;
