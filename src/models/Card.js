const db = require("../database/postgres.db.js");

class Card {
  constructor({ card_id, question, description, answer }) {
    this.card_id = card_id;
    this.question = question;
    this.description = description;
    this.answer = answer;
  }

  async saveToDeck(deckId) {
    const query = { // create the card
      text: 'INSERT INTO cards(question, description, answer) VALUES($1, $2, $3) RETURNING card_id',
      values: [this.question, this.description, this.answer],
    };

    const createCard = await db.query(query);

    
    if(!createCard.rowCount) throw new Error('Card creation error.')

    let card_id = createCard.rows[0].card_id;

    const query2 = { // associate the card with the deck
    text: 'INSERT INTO deck_cards(deck_id, card_id) VALUES($1, $2) RETURNING card_id;',
      values: [deckId, card_id],
    };

    const { rowCount } = await db.query(query2);

    if(!rowCount) throw new Error('Card assignment error.')

    return { card_id };
  }

  static async getByDeckId(deckId) {
    const query = {
      text: 'SELECT c.card_id, c.question, c.description, c.answer FROM cards c JOIN deck_cards dc ON c.card_id = dc.card_id WHERE dc.deck_id = $1;',
      values: [deckId],
    };
    const { rows } = await db.query(query);
    return rows.map((row) => new Card(row));
  }
}

module.exports = Card;
