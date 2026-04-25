-- Seed data for Bible study groups
-- This creates initial groups to help populate the community

INSERT INTO groups (id, name, description, category, icon_emoji, created_by, member_count, discussion_count)
VALUES 
  (
    gen_random_uuid(),
    'Genesis Study Circle',
    'Deep dive into the book of Genesis, exploring creation, the patriarchs, and God''s covenant with His people.',
    'book-study',
    '📖',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Prayer Warriors',
    'Join us in lifting up prayers for our community, nation, and world. Share prayer requests and testimonies.',
    'prayer',
    '🙏',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Romans Deep Study',
    'An intensive study of Paul''s epistle to the Romans. Perfect for those seeking to understand grace, faith, and justification.',
    'book-study',
    '📚',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Apologetics & Evidence',
    'Explore the logical and historical evidence for Christianity. Discuss difficult questions and strengthen your faith through reason.',
    'theology',
    '🤔',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Psalms & Worship',
    'Study the Psalms together and explore how they guide our worship and relationship with God.',
    'book-study',
    '🎵',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Gospel Harmony Study',
    'Compare and contrast the four gospels to gain a comprehensive understanding of Jesus'' life and teachings.',
    'academic',
    '✨',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Biblical Theology',
    'Explore overarching theological themes throughout Scripture. Study topics like redemption, kingdom of God, and covenant.',
    'theology',
    '⛪',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'New Testament Commentary',
    'Work through New Testament books with detailed analysis and commentary. Perfect for in-depth study.',
    'commentary',
    '📖',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Hebrew & Greek Word Studies',
    'Dig deep into the original languages. Understand Hebrew and Greek words to unlock deeper meaning in Scripture.',
    'academic',
    '🔍',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Pastoral Leadership Forum',
    'A discussion space for pastors, elders, and spiritual leaders to share insights on ministry and pastoral care.',
    'pastoral',
    '👨‍🧑‍🤝',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Topical Studies: Christian Living',
    'Explore practical applications of Scripture to everyday Christian life. Topics include prayer, discipline, relationships, and ethics.',
    'topical',
    '❤️',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  ),
  (
    gen_random_uuid(),
    'Old Testament Survey',
    'Journey through the Old Testament. Understand the historical context, key events, and theological themes.',
    'book-study',
    '⛩️',
    (SELECT id FROM auth.users LIMIT 1),
    0,
    0
  );

-- Note: Replace (SELECT id FROM auth.users LIMIT 1) with actual user IDs when seeding
-- This assumes at least one user exists in the auth.users table
