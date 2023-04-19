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
      console.error(`Error getting decks with deck_id ${deck_id}:`, err);
      throw err;
    }
  }

  static async save(name,user_id) {
    const query = {
      text: 'INSERT INTO decks(name, user_id) VALUES ($1, $2) RETURNING deck_id;',
      values: [name, user_id],
    };
    try {
      const result = await db.query(query);
      this.deck_id = result.rows[0].deck_id;

      return this.deck_id
    } catch (err) {
      console.error('Error saving deck:', err);
      throw err;
    }
  }

  async update(data){
    try{
      const {name} = data;
      const resp = await db.query("UPDATE decks SET name = $1 RETURNING *;",[name])
      return resp.rows[0];
    }
    catch{
      throw new Error("Unable to update")
    }
  }

  async destroy(){
    try{
      const card_id = await db.query("SELECT card_id FROM deck_cards WHERE deck_id = $1",[this.deck_id])
      const removeFromRelation = await db.query("DELETE FROM deck_cards WHERE deck_id = $1 AND card_id = $2",[this.deck_id, card_id.rows[0].card_id])
      await db.query("DELETE FROM decks WHERE deck_id = $1;", [this.deck_id]);

      return this.deck_id;
    }
    catch(error){
      console.log(error);
      throw new Error(error.message)
    }
  }
 
}

module.exports = Deck;