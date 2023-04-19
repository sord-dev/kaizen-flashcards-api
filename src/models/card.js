const db = require("../database/postgres.db.js");

class Card {
  constructor({ card_id, question, description, answer }) {
    this.card_id = card_id;
    this.question = question;
    this.description = description;
    this.answer = answer;
  }
  static async getById(id) {
    try {
      const resp = await db.query("SELECT * FROM cards WHERE card_id = $1 LIMIT 1;", [id])

      return new Card(resp.rows[0]);
    }
    catch {
      throw new Error("Unable to get one by id")
    }
  }
  static async getID(Card) {
    try {
      const resp = await db.query("SELECT * FROM cards WHERE name = $1", [Card])
      return new Card(resp.rows[0]);
    }
    catch {
      throw new Error("Unable to get one id")
    }
  }
  static async GetAllByUserID(user) {
    const resp = await db.query("SELECT * FROM deck_cards WHERE user_id = $1", [user])
    return resp.map((e) => Card(e))
  }

  static async getCardByDeck(deckid, cardID) {
    const resp = await db.query("SELECT * FROM cards JOIN deck_cards dc ON dc.card_id = cards.card_id JOIN decks ON dc.deck_id = decks.deck_id WHERE decks.deck_id = $1 and cards.card_id = $2", [deckid, cardID])

    console.log("UPDATEING", resp.rows);

    return new Card(resp.rows[0]);

  }

  static async saveToDeck(data, deckId) {
    const { question, description, answer } = data;
    const query = { // create the card
      text: 'INSERT INTO cards(question, description, answer) VALUES($1, $2, $3) RETURNING *',
      values: [question, description, answer],
    };

    const createCard = await db.query(query);
    
    if(!createCard.rowCount) throw new Error('Card creation error.')
    
    let card_id = createCard.rows[0].card_id;
    const query2 = { // associate the card with the deck
      text: 'INSERT INTO deck_cards(deck_id, card_id) VALUES($1, $2) RETURNING card_id;',
      values: [deckId,card_id],
    };
    
    console.log(query2)
      const { rowCount } = await db.query(query2);

    if (!rowCount) throw new Error('Card assignment error.')

    return { card_id };
  }
    static async changeContent (data,card_id){
      const {question,description,answer} = data;
      try{
        const resp = await db.query("UPDATE cards SET question = $1,description = $2, answer = $3 WHERE card_id = $4 RETURNING* ;",[question,description,answer,card_id]);
        return resp.rows[0];
      }
      catch{
        throw new Error("Unable to change card content")
      }
    }
    static async Destroy (card_id){
      try{
        const resp = await db.query("DELETE FROM cards WHERE card_id = $1",[card_id])
        if (resp.rows.length >1){
        throw new Error("Unable to delete card")
        }
        return resp.rows[0];
      }
      catch(e){
        throw new Error(e)
      }

      return this.card_id;
    }
  static async getByDeckId(deckId) {
    const response = await db.query("SELECT c.card_id, c.question, c.description, c.answer FROM cards c JOIN deck_cards dc ON c.card_id = dc.card_id WHERE dc.deck_id = $1;", [deckId]);

    if (!response.rowCount) {
      throw new Error('No such deck found.')
    }

    return response.rows.map((row) => new Card(row));
  }
}

module.exports = Card;