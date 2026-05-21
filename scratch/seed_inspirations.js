const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const quotes = [
  { title: "🎓 Wisdom", content: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", type: "Quote" },
  { title: "🌱 Growth", content: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", type: "Learning" },
  { title: "✨ Potential", content: "Do not wait for leaders; do it alone, person to person.", author: "Mother Teresa", type: "Leadership" },
  { title: "🚀 Dream", content: "You have to dream before your dreams can come true.", author: "A.P.J. Abdul Kalam", type: "Motivation" },
  { title: "💡 Innovation", content: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, knowledge makes you great.", author: "A.P.J. Abdul Kalam", type: "Wisdom" },
  { title: "📚 Excellence", content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", type: "Habit" },
  { title: "🎯 Focus", content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", type: "Focus" },
  { title: "🌿 Curiosity", content: "I have no special talent. I am only passionately curious.", author: "Albert Einstein", type: "Curiosity" },
  { title: "🌈 Success", content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", type: "Perseverance" },
  { title: "🌟 Courage", content: "It always seems impossible until it's done.", author: "Nelson Mandela", type: "Courage" },
  { title: "🔥 Passion", content: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", type: "Learning" },
  { title: "🌻 Hope", content: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X", type: "Education" },
  { title: "💎 Quality", content: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle", type: "Wisdom" },
  { title: "🛡️ Integrity", content: "Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr.", type: "Character" },
  { title: "🌠 Future", content: "The best way to predict the future is to create it.", author: "Abraham Lincoln", type: "Vision" },
  { title: "💪 Strength", content: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi", type: "Strength" },
  { title: "🗺️ Explorer", content: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", type: "Learning" },
  { title: "📈 Improvement", content: "Continuous improvement is better than delayed perfection.", author: "Mark Twain", type: "Growth" },
  { title: "🎨 Creation", content: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", type: "Wisdom" },
  { title: "⚡ Action", content: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe", type: "Action" },
  { title: "🪁 Freedom", content: "Education is the key to unlock the golden door of freedom.", author: "George Washington Carver", type: "Education" },
  { title: "⭐ Believe", content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", type: "Self-Belief" },
  { title: "🔑 Key", content: "The expert in anything was once a beginner.", author: "Helen Hayes", type: "Growth" },
  { title: "🛤️ Journey", content: "The secret of getting ahead is getting started.", author: "Mark Twain", type: "Motivation" },
  { title: "🧱 Foundation", content: "Better than a thousand days of diligent study is one day with a great teacher.", author: "Japanese Proverb", type: "Mentorship" },
  { title: "🌊 Adaptability", content: "Be like water making its way through cracks. Do not be assertive, but adjust.", author: "Bruce Lee", type: "Adaptability" },
  { title: "🦚 Pride", content: "Education is not preparation for life; education is life itself.", author: "John Dewey", type: "Education" },
  { title: "🧭 Compass", content: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb", type: "Collaboration" },
  { title: "🏔️ Summit", content: "There are no shortcuts to any place worth going.", author: "Beverly Sills", type: "Perseverance" },
  { title: "⛲ Fountain", content: "A teacher affects eternity; he can never tell where his influence stops.", author: "Henry Adams", type: "Mentorship" },
  { title: "🐚 Patient", content: "Genius is eternal patience.", author: "Michelangelo", type: "Patience" },
  { title: "🍎 Mentor", content: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", type: "Learning" },
  { title: "🍂 Resilience", content: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", type: "Resilience" },
  { title: "🕊️ Peace", content: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", type: "Education" },
  { title: "🧘 Balance", content: "Wisdom begins in wonder.", author: "Socrates", type: "Curiosity" },
  { title: "☀️ Bright", content: "The purpose of education is to replace an empty mind with an open one.", author: "Malcolm Forbes", type: "Education" },
  { title: "🛠️ Skill", content: "Practice makes progress, not perfection.", author: "Unknown", type: "Habit" },
  { title: "💎 Value", content: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein", type: "Wisdom" },
  { title: "🕯️ Light", content: "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened.", author: "Buddha", type: "Sharing" },
  { title: "⏳ Time", content: "Time is the wisest counselor of all.", author: "Pericles", type: "Patience" },
  { title: "🎈 Joy", content: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss", type: "Learning" },
  { title: "🪶 Hope", content: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson", type: "Hope" },
  { title: "🍇 Harvest", content: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson", type: "Patience" },
  { title: "🪁 Purpose", content: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain", type: "Purpose" },
  { title: "💫 Spark", content: "Every student can learn, just not on the same day or in the same way.", author: "George Evans", type: "Learning" },
  { title: "🌳 Roots", content: "He who opens a school door, closes a prison.", author: "Victor Hugo", type: "Education" },
  { title: "🏔️ Climb", content: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh", type: "Growth" },
  { title: "🎨 Imagination", content: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", type: "Creativity" },
  { title: "🦋 Change", content: "Education is the ability to meet life's situations.", author: "Dr. John G. Hibben", type: "Adaptability" },
  { title: "🏛️ Pillar", content: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", type: "Courage" },
  { title: "🥇 Effort", content: "Quality is not an act, it is a habit.", author: "Aristotle", type: "Habit" },
  { title: "🌊 Flow", content: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar", type: "Attitude" },
  { title: "🌾 Humility", content: "The direction in which education starts a man will determine his future in life.", author: "Plato", type: "Education" },
  { title: "🔗 Unity", content: "Alone we can do so little; together we can do so much.", author: "Helen Keller", type: "Collaboration" },
  { title: "🗺️ Horizon", content: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams", type: "Learning" },
  { title: "🕯️ Spark", content: "Teaching is the highest form of understanding.", author: "Aristotle", type: "Mentorship" },
  { title: "🏹 Vision", content: "If you can dream it, you can do it.", author: "Walt Disney", type: "Vision" },
  { title: "🌟 Courage", content: "Courage is grace under pressure.", author: "Ernest Hemingway", type: "Courage" },
  { title: "🌻 Bright", content: "Keep your face always toward the sunshine - and shadows will fall behind you.", author: "Walt Whitman", type: "Attitude" },
  { title: "🐾 Steps", content: "Step by step and the thing is done.", author: "Charles Atlas", type: "Perseverance" },
  { title: "🛡️ Honor", content: "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.", author: "Albert Einstein", type: "Mentorship" },
  { title: "🌱 Origin", content: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", type: "Action" },
  { title: "🎒 Journey", content: "To travel is to learn.", author: "Proverb", type: "Learning" },
  { title: "⛲ Fountain", content: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb", type: "Learning" },
  { title: "💎 Refine", content: "The objective of education is to prepare the young to educate themselves throughout their lives.", author: "Robert M. Hutchins", type: "Education" },
  { title: "🗝️ Open", content: "Always be a first-rate version of yourself, instead of a second-rate version of somebody else.", author: "Judy Garland", type: "Identity" },
  { title: "🌅 Dawn", content: "You do not find a happy life. You make it.", author: "Thomas S. Monson", type: "Action" },
  { title: "💡 Bright", content: "Education's purpose is to replace an empty mind with an open one.", author: "Malcolm Forbes", type: "Education" },
  { title: "🪁 Freedom", content: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle", type: "Wisdom" },
  { title: "🌿 Seed", content: "Instruction ends in the schoolroom, but education ends only with life.", author: "Frederick W. Robertson", type: "Learning" },
  { title: "🔥 Ignite", content: "The mind is not a vessel to be filled, but a fire to be ignited.", author: "Plutarch", type: "Wisdom" },
  { title: "🌌 Infinite", content: "The secret of education lies in respecting the pupil.", author: "Ralph Waldo Emerson", type: "Mentorship" },
  { title: "📚 Reader", content: "Today a reader, tomorrow a leader.", author: "Margaret Fuller", type: "Leadership" },
  { title: "🌾 Harvest", content: "What we learn with pleasure we never forget.", author: "Alfred Mercier", type: "Learning" },
  { title: "🏗️ Build", content: "If you think education is expensive, try ignorance.", author: "Andy McIntyre", type: "Value" },
  { title: "🎯 Aim", content: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein", type: "Wisdom" },
  { title: "🛡️ Shield", content: "Education is a better safeguard of liberty than a standing army.", author: "Edward Everett", type: "Education" },
  { title: "⛵ Sail", content: "The teacher who is indeed wise does not bid you to enter the house of his wisdom but rather leads you to the threshold of your mind.", author: "Kahlil Gibran", type: "Mentorship" },
  { title: "🧘 Peaceful", content: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", type: "Purpose" },
  { title: "🦋 Evolve", content: "Change is the end result of all true learning.", author: "Leo Buscaglia", type: "Learning" },
  { title: "🌟 Star", content: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", type: "Wisdom" },
  { title: "💪 Strong", content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", type: "Action" },
  { title: "💎 Core", content: "Genius without education is like silver in the mine.", author: "Benjamin Franklin", type: "Wisdom" },
  { title: "🌻 Hope", content: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt", type: "Growth" },
  { title: "🌈 Color", content: "Live the life you've imagined.", author: "Henry David Thoreau", type: "Vision" },
  { title: "🚀 Dream", content: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney", type: "Courage" },
  { title: "⚡ Power", content: "Knowledge is power.", author: "Francis Bacon", type: "Wisdom" },
  { title: "🌳 Nature", content: "Nature is the best teacher.", author: "Unknown", type: "Learning" },
  { title: "🎨 Creative", content: "The creation of a thousand forests is in one acorn.", author: "Ralph Waldo Emerson", type: "Potential" },
  { title: "💡 Think", content: "Think like a wise man but communicate in the language of the people.", author: "William Butler Yeats", type: "Wisdom" },
  { title: "🌱 Rooted", content: "Be not afraid of growing slowly, be afraid only of standing still.", author: "Chinese Proverb", type: "Growth" },
  { title: "🏹 Target", content: "Aim for the moon. If you miss, you may hit a star.", author: "W. Clement Stone", type: "Vision" },
  { title: "📚 Book", content: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero", type: "Wisdom" },
  { title: "💎 Precious", content: "Education is not the filling of a pail, but the lighting of a fire.", author: "William Butler Yeats", type: "Education" },
  { title: "🌊 Tide", content: "The art of teaching is the art of assisting discovery.", author: "Mark Van Doren", type: "Mentorship" },
  { title: "💫 Bright", content: "Believe and act as if it were impossible to fail.", author: "Charles Kettering", type: "Self-Belief" },
  { title: "🗺️ Map", content: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust", type: "Wisdom" },
  { title: "🚪 Door", content: "Learning is the only thing the mind never exhausts, never fears, and never regrets.", author: "Leonardo da Vinci", type: "Learning" },
  { title: "🌾 Grain", content: "Character is destiny.", author: "Heraclitus", type: "Character" },
  { title: "🌟 Shine", content: "Never lose your inner spark.", author: "Unknown", type: "Motivation" }
];

async function seedInspirations() {
  console.log(`Starting to seed ${quotes.length} premium inspiring quotations...`);
  
  // Clean up any existing system-seeded ones first if necessary, or just insert
  // Let's do a bulk insert!
  const rows = quotes.map(q => ({
    title: q.title,
    content: q.content,
    author: q.author,
    type: "Quote",
    is_published: true
  }));

  const { data, error } = await supabase
    .from('inspiration')
    .insert(rows);

  if (error) {
    console.error("Error seeding inspiration table:", error);
    process.exit(1);
  } else {
    console.log("Successfully seeded 100 inspiring education quotes into the 'inspiration' table!");
    process.exit(0);
  }
}

seedInspirations();
