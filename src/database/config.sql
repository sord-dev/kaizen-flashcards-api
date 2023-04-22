DROP TABLE IF EXISTS deck_cards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_logged_in CASCADE;
DROP TABLE IF EXISTS user_question_dif CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

CREATE TABLE user_stats (
  user_stats_id INT GENERATED ALWAYS AS IDENTITY,
  amount INT DEFAULT 0,
  correct INT DEFAULT 0,
  PRIMARY KEY (user_stats_id)
);

CREATE TABLE users (
  user_id  INT GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_stats_id INT NOT NULL,
  streak JSON,
  PRIMARY KEY (user_id),
  UNIQUE (user_id),
  FOREIGN KEY (user_stats_id) REFERENCES user_stats(user_stats_id)
);

CREATE TABLE decks (
  deck_id  INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  user_id INT,
  PRIMARY KEY(deck_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
   UNIQUE (deck_id)
);

CREATE TABLE cards(
    card_id INT GENERATED ALWAYS AS IDENTITY,
    question VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
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

CREATE TABLE user_question_dif(
  question_dif_id INT GENERATED ALWAYS AS IDENTITY,
  difficulty VARCHAR(255),
  user_id INT NOT NULL,
  card_id INT NOT NULL,
  PRIMARY KEY (question_dif_id),
  FOREIGN KEY (card_id) REFERENCES cards(card_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO user_stats (amount, correct) VALUES (0, 0);

-- Insert a user
INSERT INTO users (username, password, user_stats_id, streak) VALUES ('admin', '$2b$10$/QzbJnjbKX7Bgma7L9DfGu3wRMKFMfCtc.Jekyh3PbxDoSjuPEngm', 1, '{ "count": 1,"lastHit": "2023-04-22T07:24:16.165Z", "startDate": "2023-04-22T07:24:16.165Z"}');

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

