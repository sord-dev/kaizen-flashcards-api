const db = require("../database/postgres.db.js");

class Card {
  constructor({ card_id, question, description, answer }) {
    this.card_id = card_id;
    this.question = question;
    this.description = description;
    this.answer = answer;
  }
  static async getById(id){
    try{
      console.log(id)
      const resp = await db.query("SELECT * FROM cards WHERE card_id = $1",[id])
      return resp.rows[0];
    }
    catch{
      throw new Error("Unable to get one by id")
    }
  }
  static async getID(Card){
    try{
      const resp = await db.query("SELECT * FROM cards WHERE name = $1",[Card])
      return resp.rows[0];
    }
    catch{
      throw new Error("Unable to get one id")
    }
  }
  static async GetAllByUserID(user){
    const resp = await db.query("SELECT * FROM deck_cards WHERE user_id = $1",[user])
    return resp.map((e) => Card(e))
  }
   static async getCardByDeck(deckid,cardID){
    try{
      const resp = await db.query("SELECT * FROM cards JOIN deck_cards dc ON dc.card_id = cards.card_id JOIN decks ON dc.deck_id = decks.deck_id WHERE deck_id =$1 and card_id = $2",[deckid,cardID])
      if (resp.rows.length > 1){
        throw new Error ("move than one")
      }
      return resp.rows[0];
    }
    catch{
      throw new Error("Unable to get card")
    }
  }

  static async saveToDeck(data,deckId) {
    const {question,description,answer} = data;
    const query = { // create the card
      text: 'INSERT INTO cards(question, description, answer) VALUES($1, $2, $3) RETURNING card_id',
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

    if(!rowCount) throw new Error('Card assignment error.')

    return { card_id };
  }
    async changeContent (data){
      const {question,description,answer} = data;
      try{
        const resp = db.query("UPDATE cards SET question = $1,description = $2, answer = $3 WHERE card_id = $4 RETURNING* ;",[question,description,answer,this.card_id])
        return resp.rows[0];
      }
      catch{
        throw new Error("Unable to change card content")
      }
    }
    async Destroy (){
      try{
        const resp = await db.query("DELETE FROM cards WHERE card_id = $1",[this.card_id])
        if (resp.rows.length >1){
        throw new Error("Unable to delete card")
        }
        return resp.rows[0];
      }
      catch{
        throw new Error("Unable to remove content")
      }
    }
  static async getByDeckId(deckId) {
    const { rows } = await db.query("SELECT c.card_id, c.question, c.description, c.answer FROM cards c JOIN deck_cards dc ON c.card_id = dc.card_id WHERE dc.deck_id = $1;",[deckId]);
    return rows.map((row) => new Card(row));
  }
}

module.exports = Card;