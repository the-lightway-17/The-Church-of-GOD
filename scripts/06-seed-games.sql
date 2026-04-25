-- Scripture Scenario Games (Expert difficulty - insightful biblical analysis)
INSERT INTO games (type, title, description, difficulty, category, question_text, content, points_on_complete, points_on_perfect, daily_challenge) VALUES
(
  'scripture_scenario',
  'Navigating the Theology of Predestination',
  'A complex theological scenario exploring predestination vs free will',
  'expert',
  'theology',
  'In Romans 9, Paul discusses election and predestination. Considering the context of the hardening of Pharaoh''s heart in Exodus, what is the best understanding of divine predestination in light of human responsibility?',
  '{"correct_answer": "divine_sovereignty_with_human_responsibility", "options": [{"id": "pure_determinism", "text": "Complete divine determinism with no human free will"}, {"id": "divine_sovereignty_with_human_responsibility", "text": "Divine sovereignty that works through human responsibility"}, {"id": "libertarian_free_will", "text": "Complete human free will with limited divine foreknowledge"}, {"id": "open_theism", "text": "God does not know future free choices"}], "commentary": "The Reformed perspective maintains that God''s sovereignty and human responsibility are not contradictory. Romans 9 emphasizes God''s election while Romans 10 emphasizes human response. The hardening of Pharaoh''s heart in Exodus shows both divine action and human responsibility - Pharaoh hardened his own heart, yet God determined to harden it."}',
  25,
  50,
  FALSE
),
(
  'scripture_scenario',
  'Jesus as Prophet, Priest, and King',
  'Understanding Christ''s threefold office in redemptive history',
  'hard',
  'christology',
  'How does Jesus'' office as Prophet in His earthly ministry relate to His current role as High Priest in heaven? What is the continuity?',
  '{"correct_answer": "prophetic_intercession", "options": [{"id": "prophetic_intercession", "text": "His prophetic word becomes the basis for His intercessory prayer"}, {"id": "temporal_distinction", "text": "Prophet and Priest are entirely separate historical roles"}, {"id": "symbolic_only", "text": "These are just symbolic titles with no real function"}, {"id": "priestly_prophet_reversal", "text": "The priestly role negates the prophetic ministry"}], "commentary": "Jesus'' prophetic ministry was fulfilled in His complete revelation of God (Hebrews 1:1-3). Now He intercedes based on that finished work. His prayers are rooted in His prophetic understanding of humanity''s needs and God''s purposes (Romans 8:34, Hebrews 7:25)."}',
  20,
  40,
  FALSE
);

-- Bible Trivia Games
INSERT INTO games (type, title, description, difficulty, category, question_text, content, points_on_complete, points_on_perfect, daily_challenge) VALUES
(
  'trivia',
  'Books of the Bible: Organization and Order',
  'Test your knowledge of biblical book organization',
  'medium',
  'general',
  'Which book of the Bible is the longest in terms of word count?',
  '{"correct_answer": "psalms", "options": [{"id": "psalms", "text": "Psalms"}, {"id": "genesis", "text": "Genesis"}, {"id": "exodus", "text": "Exodus"}, {"id": "matthew", "text": "Matthew"}], "commentary": "Psalms contains 23,103 verses and is the longest book in the Bible by verse count. It''s also significant in word count, though various translations measure this differently."}',
  10,
  20,
  TRUE
),
(
  'trivia',
  'Apostolic History: Acts and the Early Church',
  'Questions about the early church period',
  'hard',
  'history',
  'What was the name of the decree issued by Emperor Claudius that expelled Jews from Rome, mentioned in Acts 18:2?',
  '{"correct_answer": "edict_of_claudius", "options": [{"id": "edict_of_claudius", "text": "The Edict of Claudius"}, {"id": "edictum_pontifex", "text": "Edictum Pontifex"}, {"id": "senatus_consultum", "text": "Senatus Consultum"}, {"id": "praetorian_order", "text": "Praetorian Order"}], "commentary": "Suetonius and Dio Cassius mention this expulsion around 49-50 AD. This historical event provides important context for understanding Paul''s meeting with Priscilla and Aquila in Corinth."}',
  15,
  30,
  FALSE
);

-- Commentary Challenge Games
INSERT INTO games (type, title, description, difficulty, category, question_text, content, points_on_complete, points_on_perfect, daily_challenge) VALUES
(
  'commentary',
  'Sermon on the Mount: Beatitudes',
  'Understanding the deeper meaning of Jesus'' teachings',
  'medium',
  'theology',
  'What does "blessed are the merciful" in Matthew 5:7 connect to in terms of our relationship with God?',
  '{"correct_answer": "Gods_mercy_toward_us", "options": [{"id": "Gods_mercy_toward_us", "text": "God''s mercy is extended to us in the same measure we extend it"}, {"id": "eternal_rewards_only", "text": "It only promises eternal rewards in heaven"}, {"id": "moral_achievement", "text": "It''s a measure of moral achievement for salvation"}, {"id": "legal_obligation", "text": "It''s a legal obligation under the law"}], "commentary": "Jesus teaches the principle of reciprocity - showing mercy invites mercy. This reflects the character of God and anticipates the beatitude about the pure in heart seeing God. The merciful are blessed because they reflect the heart of God and will experience His mercy."}',
  15,
  30,
  TRUE
),
(
  'commentary',
  'The Kingdom of God: Present and Future',
  'Understanding the ''already/not yet'' paradigm',
  'hard',
  'theology',
  'How should we understand the kingdom of God as both present (Mark 1:15) and future (Matthew 25:31-46)?',
  '{"correct_answer": "inaugurated_eschatology", "options": [{"id": "inaugurated_eschatology", "text": "The kingdom is inaugurated now but consummated in the future"}, {"id": "purely_future", "text": "The kingdom is entirely future"}, {"id": "purely_present", "text": "The kingdom is only present, completely realized"}, {"id": "spiritual_only", "text": "The kingdom is only spiritual, not physical"}], "commentary": "This is called ''inaugurated eschatology.'' The kingdom began with Jesus'' incarnation and continues through His church, but will be fully consummated at His return. We participate in the kingdom now while awaiting its ultimate revelation."}',
  20,
  40,
  FALSE
);

-- Verse Matching Games
INSERT INTO games (type, title, description, difficulty, category, question_text, content, points_on_complete, points_on_perfect, daily_challenge) VALUES
(
  'verse_matching',
  'Match Parables to Their Meanings',
  'Connect parables with their biblical interpretations',
  'medium',
  'general',
  'Match these parables with their primary themes:',
  '{"correct_answer": ["sower_word", "talents_stewardship", "prodigal_grace"], "pairs": [{"id": "parable_sower", "text": "The Parable of the Sower", "matches": ["sower_word", "sower_faith", "sower_fruitfulness"]}, {"id": "parable_talents", "text": "The Parable of the Talents", "matches": ["talents_stewardship", "talents_judgment", "talents_reward"]}, {"id": "parable_prodigal", "text": "The Parable of the Prodigal Son", "matches": ["grace_forgiveness", "grace_repentance", "grace_reconciliation"]}], "commentary": "The Parable of the Sower teaches about the Word''s reception. The Parable of the Talents emphasizes stewardship and accountability. The Parable of the Prodigal Son illustrates God''s grace, repentance, and reconciliation. Each parable contains multiple layers of meaning."}',
  12,
  25,
  FALSE
),
(
  'verse_matching',
  'Match Prophetic Books to Their Key Themes',
  'Connect prophetic books with their central messages',
  'hard',
  'prophecy',
  'Match these prophetic books with their historical contexts and key messages:',
  '{"correct_answer": ["jeremiah_exile", "isaiah_restoration", "hosea_unfaithfulness"], "pairs": [{"id": "book_jeremiah", "text": "Jeremiah", "matches": ["jeremiah_exile", "jeremiah_judgment", "jeremiah_covenant"]}, {"id": "book_isaiah", "text": "Isaiah", "matches": ["isaiah_restoration", "isaiah_hope", "isaiah_messianic"]}, {"id": "book_hosea", "text": "Hosea", "matches": ["hosea_unfaithfulness", "hosea_love", "hosea_reconciliation"]}], "commentary": "Jeremiah prophesied during the lead-up to the Babylonian exile, emphasizing judgment and the new covenant. Isaiah contains prophetic messages about restoration and the Messiah. Hosea uses the metaphor of a wayward marriage to illustrate Israel''s unfaithfulness and God''s enduring love."}',
  18,
  35,
  FALSE
);
