const db = require("../database/postgres.db.js");

class Card {
  constructor({ card_id, question, description, answer }) {
    this.card_id = card_id;
    this.question = question;
    this.description = description;
    this.answer = answer;
  }
  static async GetDeckID(deckId){
    const resp = await db.query("",[username])
  }
  static async GetAllByUserID(user){
    const resp = await db.query("SELECT * FROM deck_cards WHERE user_id = $1",[user])
  }
  static async saveToDeck(question,description,answer,deckId) {
    const createCard = await db.query("INSERT INTO cards(question, description, answer) VALUES($1, $2, $3) RETURNING card_id",[question,description,answer]);
    if(!createCard.rowCount) throw new Error('Card creation error.')

    let card_id = createCard.rows[0].card_id;
    const { rowCount } = await db.query('INSERT INTO deck_cards(deck_id, card_id) VALUES($1, $2) RETURNING card_id;',[deckId,card_id]);

    if(!rowCount) throw new Error('Card assignment error.')

    return { card_id };
  }
  static async getByDeckId(deckId) {
    const { rows } = await db.query("SELECT c.card_id, c.question, c.description, c.answer FROM cards c JOIN deck_cards dc ON c.card_id = dc.card_id WHERE dc.deck_id = $1;",deckId);
    return rows.map((row) => new Card(row));
  }
}

module.exports = Card;