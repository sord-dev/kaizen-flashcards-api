DROP TABLE IF EXISTS deck_cards;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id  INT GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  UNIQUE (user_id)
);
CREATE TABLE token (
  token_id INT GENERATED ALWAYS AS IDENTITY,
  Token VARCHAR(255) UNIQUE,
  user_id INT NOT NULL,
  PRIMARY Key (token_id),
  FOREIGN KEY (user_id) REFERENCES users
);
CREATE TABLE decks (
  deck_id  INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255),
  user_id INT,
  PRIMARY KEY(deck_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
   UNIQUE (deck_id)
);

CREATE TABLE cards(
    card_id INT GENERATED ALWAYS AS IDENTITY,
    question VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    answer VARCHAR(255) NOT NULL,
    UNIQUE (card_id)
);

CREATE TABLE deck_cards (
  id  INT GENERATED ALWAYS AS IDENTITY,
  deck_id INT,
  card_id INT,
  FOREIGN KEY (deck_id) REFERENCES decks(deck_id),
  FOREIGN KEY (card_id) REFERENCES cards(card_id),
  UNIQUE (id)
);

-- Insert a user
INSERT INTO users (username, password) VALUES ('admin', '$2b$10$/QzbJnjbKX7Bgma7L9DfGu3wRMKFMfCtc.Jekyh3PbxDoSjuPEngm');

-- Insert a deck created by user 1
INSERT INTO decks (name, user_id) VALUES ('Kanji', 1);

-- Insert some example cards with their questions, answers, and descriptions
INSERT INTO cards (question, answer, description) VALUES
  ('亜', 'Sub-', 'The kanji for the prefix "sub-" in Japanese'),
  ('逆', 'Reverse', 'The kanji for "reverse" or "opposite" in Japanese'),
  ('駆', 'Rush', 'The kanji for "rush" or "gallop" in Japanese'),
  ('妙', 'Wonderful', 'The kanji for "wonderful" or "marvelous" in Japanese'),
  ('憂', 'Grief', 'The kanji for "grief" or "sorrow" in Japanese');


-- Link cards to deck 1
INSERT INTO deck_cards (deck_id, card_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5);
