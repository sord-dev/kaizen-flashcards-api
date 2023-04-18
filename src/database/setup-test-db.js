const db = require("./postgres.db.js")

const createDbEnv = async () => {
    await db.query("CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL)")
    await db.query("CREATE TEMPORARY TABLE decks (LIKE decks INCLUDING ALL)")
    await db.query("CREATE TEMPORARY TABLE cards (LIKE cards INCLUDING ALL)")
    await db.query("CREATE TEMPORARY TABLE deck_cards (LIKE deck_cards INCLUDING ALL)")
}

const populateDbEnv = async () => {
    await db.query("INSERT INTO pg_temp.users (username, password) VALUES ('admin', '$2b$10$/QzbJnjbKX7Bgma7L9DfGu3wRMKFMfCtc.Jekyh3PbxDoSjuPEngm')")
    await db.query("INSERT INTO pg_temp.decks (name, user_id) VALUES ('Kanji', 1)")

    await db.query("INSERT INTO pg_temp.cards (question, answer, description) VALUES ('亜', 'Sub-', 'The kanji for the prefix \"sub\" in Japanese'), ('逆', 'Reverse', 'The kanji for \"reverse\" or \"opposite\" in Japanese'), ('駆', 'Rush', 'The kanji for \"rush\" or \"gallop\" in Japanese'),('妙', 'Wonderful', 'The kanji for wonderful or marvelous in Japanese'), ('憂', 'Grief', 'The kanji for \"grief\" or \"sorrow\" in Japanese');");

    await db.query("INSERT INTO pg_temp.deck_cards (deck_id, card_id) VALUES (1, 1),(1, 2), (1, 3), (1, 4), (1, 5)")
}

const destroyDbEnv = async () => {
    await db.query("DROP TABLE IF EXISTS pg_temp.deck_cards")
    await db.query("DROP TABLE IF EXISTS pg_temp.cards")
    await db.query("DROP TABLE IF EXISTS pg_temp.decks")
    await db.query("DROP TABLE IF EXISTS pg_temp.users")
}

module.exports = { createDbEnv, populateDbEnv, destroyDbEnv };