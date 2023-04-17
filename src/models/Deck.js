const db = require("../database/postgres.db.js");

class Deck {
  constructor(deck_id, name, user_id) {
    this.deck_id = deck_id;
    this.name = name;
    this.user_id = user_id;
  }

  static async getAll(user_id) {
    const query = {
      text: 'SELECT * FROM decks WHERE user_id = $1',
      values: [user_id],
    };

    try {
      const result = await db.query(query);
      const decks = result.rows.map(row => new Deck(row.deck_id, row.name, row.user_id));
      return decks;
    } catch (err) {
      console.error('Error getting decks:', err);
      throw err;
    }
  }

  static async getById(deck_id) {
    const query = {
      text: 'SELECT * FROM decks WHERE deck_id = $1',
      values: [deck_id],
    };

    try {
      const result = await db.query(query);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return new Deck(row.deck_id, row.name, row.user_id);
    } catch (err) {
      console.error(`Error getting deck with deck_id ${deck_id}:`, err);
      throw err;
    }
  }

  async save() {
    const query = {
      text: 'INSERT INTO decks(name, user_id) VALUES ($1, $2) RETURNING deck_id',
      values: [this.name, this.user_id],
    };

    try {
      const result = await db.query(query);
      this.deck_id = result.rows[0].deck_id;
    } catch (err) {
      console.error('Error saving deck:', err);
      throw err;
    }
  }
}

module.exports = Deck;