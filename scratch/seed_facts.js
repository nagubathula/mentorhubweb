const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const facts = [
  {
    "content": "Sharks existed before trees first appeared on Earth—by nearly **50 million years**.",
    "category": "world",
    "emoji": "🦈"
  },
  {
    "content": "There are more possible chess games than atoms estimated in the observable universe.",
    "category": "world",
    "emoji": "♟️"
  },
  {
    "content": "A single lightning bolt can heat the surrounding air to **five times hotter than the Sun's surface**.",
    "category": "world",
    "emoji": "⚡"
  },
  {
    "content": "The Eiffel Tower becomes about **15 centimeters taller** during summer because metal expands in heat.",
    "category": "world",
    "emoji": "🗼"
  },
  {
    "content": "Antarctica is the driest, windiest, and coldest continent on Earth.",
    "category": "world",
    "emoji": "❄️"
  },
  {
    "content": "A teaspoon of neutron star material would weigh about **one billion tons** on Earth.",
    "category": "world",
    "emoji": "💫"
  },
  {
    "content": "The fingerprints of a koala are so similar to humans that they can confuse forensic experts.",
    "category": "world",
    "emoji": "🐨"
  },
  {
    "content": "The world's oldest known tree is over **4,800 years old** and is still alive.",
    "category": "world",
    "emoji": "🌳"
  },
  {
    "content": "There are more stars in the universe than grains of sand on all Earth's beaches.",
    "category": "world",
    "emoji": "✨"
  },
  {
    "content": "Earth is the only known planet not named after a mythological god or goddess.",
    "category": "world",
    "emoji": "🌍"
  },
  {
    "content": "A day on Venus is longer than a year on Venus.",
    "category": "world",
    "emoji": "🪐"
  },
  {
    "content": "Bananas are berries, but strawberries are not.",
    "category": "world",
    "emoji": "🍌"
  },
  {
    "content": "Honey never spoils; jars found in ancient Egyptian tombs are still edible after 3,000 years.",
    "category": "world",
    "emoji": "🍯"
  },
  {
    "content": "Wombat poop is cube-shaped, which stops it from rolling away.",
    "category": "world",
    "emoji": "💩"
  },
  {
    "content": "The first computer bug was a real moth found trapped in a computer relay.",
    "category": "world",
    "emoji": "🪲"
  },
  {
    "content": "The total weight of all ants on Earth is roughly equal to the total weight of all humans.",
    "category": "world",
    "emoji": "🐜"
  },
  {
    "content": "Oxford University is older than the Aztec Empire.",
    "category": "world",
    "emoji": "🏛️"
  },
  {
    "content": "Venus is the hottest planet in our solar system, with a surface temperature of over **450 degrees Celsius**.",
    "category": "space",
    "emoji": "🔥"
  },
  {
    "content": "One day on Saturn is only **10.7 hours** long, but its year is 29 Earth years.",
    "category": "space",
    "emoji": "🪐"
  },
  {
    "content": "Footprints left by astronauts on the Moon will last for at least **100 million years**.",
    "category": "space",
    "emoji": "👣"
  },
  {
    "content": "Space is completely silent because there is no atmosphere for sound waves to travel through.",
    "category": "space",
    "emoji": "🤫"
  },
  {
    "content": "Sunset on Mars appears blue because fine dust lets blue light penetrate more efficiently.",
    "category": "space",
    "emoji": "🌅"
  },
  {
    "content": "The Moon is moving away from Earth at a rate of about **3.8 centimeters per year**.",
    "category": "space",
    "emoji": "🌙"
  },
  {
    "content": "Neutron stars can spin up to **600 times per second** after their collapse.",
    "category": "space",
    "emoji": "🌀"
  },
  {
    "content": "One million Earths could fit inside the Sun.",
    "category": "space",
    "emoji": "☀️"
  },
  {
    "content": "A spacecraft can travel out of our solar system, but it would take **tens of thousands of years** to reach the nearest star.",
    "category": "space",
    "emoji": "🚀"
  },
  {
    "content": "The solar wind travels at speeds of up to **400 kilometers per second**.",
    "category": "space",
    "emoji": "💨"
  },
  {
    "content": "Halley's Comet will next be visible from Earth in the year **2061**.",
    "category": "space",
    "emoji": "☄️"
  },
  {
    "content": "The center of a comet is a 'dirty snowball' of ice, dust, and rock.",
    "category": "space",
    "emoji": "❄️"
  },
  {
    "content": "A day on Jupiter lasts only **9 hours and 56 minutes**.",
    "category": "space",
    "emoji": "⚡"
  },
  {
    "content": "The Milky Way galaxy is about **100,000 light-years** across.",
    "category": "space",
    "emoji": "🌌"
  },
  {
    "content": "The temperature in void space is about **minus 270 degrees Celsius**.",
    "category": "space",
    "emoji": "🥶"
  },
  {
    "content": "Olympus Mons on Mars is the tallest volcano in the solar system, three times higher than Mount Everest.",
    "category": "space",
    "emoji": "🏔️"
  },
  {
    "content": "Uranus spins on its side, like a rolling ball, relative to its orbital plane.",
    "category": "space",
    "emoji": "🟢"
  },
  {
    "content": "If you uncoiled all the DNA in your body, it would stretch to the Moon and back **6,000 times**.",
    "category": "human",
    "emoji": "🧬"
  },
  {
    "content": "The human eye can distinguish about **10 million different colors**.",
    "category": "human",
    "emoji": "👁️"
  },
  {
    "content": "Your heart beats about **100,000 times a day**, pumping around 7,500 liters of blood.",
    "category": "human",
    "emoji": "❤️"
  },
  {
    "content": "Information travels along nerves to the brain at speeds of up to **400 kilometers per hour**.",
    "category": "human",
    "emoji": "⚡"
  },
  {
    "content": "Humans are the only animals known to shed emotional tears.",
    "category": "human",
    "emoji": "😢"
  },
  {
    "content": "An adult human body is made up of about **7 octillion atoms**.",
    "category": "human",
    "emoji": "🔬"
  },
  {
    "content": "The strongest muscle in the human body relative to its size is the jaw muscle (masseter).",
    "category": "human",
    "emoji": "💪"
  },
  {
    "content": "Human teeth are just as strong as shark teeth.",
    "category": "human",
    "emoji": "🦷"
  },
  {
    "content": "Your nose can remember 50,000 different scents.",
    "category": "human",
    "emoji": "👃"
  },
  {
    "content": "A baby has about 300 bones at birth, which fuse to become 206 bones in an adult.",
    "category": "human",
    "emoji": "👶"
  },
  {
    "content": "The human brain can store up to **2.5 petabytes** of information, equivalent to 3 million hours of TV.",
    "category": "human",
    "emoji": "🧠"
  },
  {
    "content": "The stomach produces a new layer of mucus every two weeks to prevent digesting itself.",
    "category": "human",
    "emoji": "🧪"
  },
  {
    "content": "A sneeze can travel at speeds of over **160 kilometers per hour**.",
    "category": "human",
    "emoji": "💨"
  },
  {
    "content": "About 60% of the human body is water.",
    "category": "human",
    "emoji": "💧"
  },
  {
    "content": "Your bones are about **four times stronger than concrete** of the same weight.",
    "category": "human",
    "emoji": "🦴"
  },
  {
    "content": "Skin is the human body's largest organ and sheds millions of dead cells daily.",
    "category": "human",
    "emoji": "✋"
  },
  {
    "content": "The small intestine is about **6 meters long**, which is four times taller than the average human.",
    "category": "human",
    "emoji": "📏"
  },
  {
    "content": "Octopuses have **three hearts**, nine brains, and blue blood.",
    "category": "animal",
    "emoji": "🐙"
  },
  {
    "content": "Honeybees can flap their wings up to **200 times per second**.",
    "category": "animal",
    "emoji": "🐝"
  },
  {
    "content": "Cows have best friends and experience stress when they are separated from them.",
    "category": "animal",
    "emoji": "🐄"
  },
  {
    "content": "Sea otters hold hands while sleeping to keep from drifting apart.",
    "category": "animal",
    "emoji": "🦦"
  },
  {
    "content": "Flamingos are not pink at birth; they turn pink from eating brine shrimp and algae.",
    "category": "animal",
    "emoji": "🦩"
  },
  {
    "content": "Sloths can take up to a month to digest a single leaf.",
    "category": "animal",
    "emoji": "🦥"
  },
  {
    "content": "A blue whale's heart is the size of a small car and weighs about **600 kilograms**.",
    "category": "animal",
    "emoji": "🐋"
  },
  {
    "content": "Hummingbirds are the only birds that can fly backwards.",
    "category": "animal",
    "emoji": "🐦"
  },
  {
    "content": "A snail can sleep for up to **three years** if the weather is too dry or cold.",
    "category": "animal",
    "emoji": "🐌"
  },
  {
    "content": "Polar bear skin is black, and their fur is actually translucent, not white.",
    "category": "animal",
    "emoji": "🐻"
  },
  {
    "content": "Butterfly taste buds are located on their feet to help them find host plants.",
    "category": "animal",
    "emoji": "🦋"
  },
  {
    "content": "A jellyfish is 95% water and has no brain, heart, or bones.",
    "category": "animal",
    "emoji": "🪼"
  },
  {
    "content": "Male seahorses are the ones that give birth to their young.",
    "category": "animal",
    "emoji": "🧜‍♂️"
  },
  {
    "content": "A newborn kangaroo is only about the size of a lima bean.",
    "category": "animal",
    "emoji": "🦘"
  },
  {
    "content": "Elephants are the only land animals that cannot jump.",
    "category": "animal",
    "emoji": "🐘"
  },
  {
    "content": "A cat's jaw cannot move sideways, which is why they cannot chew large chunks of food.",
    "category": "animal",
    "emoji": "🐱"
  },
  {
    "content": "Turritopsis dohrnii is a jellyfish species that is biologically immortal.",
    "category": "animal",
    "emoji": "🪼"
  },
  {
    "content": "Ada Lovelace wrote the world's first computer algorithm in **1843** for Charles Babbage's Analytical Engine.",
    "category": "tech",
    "emoji": "💻"
  },
  {
    "content": "The first website ever created is still online today. It went live at CERN in **1991**.",
    "category": "tech",
    "emoji": "🌐"
  },
  {
    "content": "Python was named after the British comedy group 'Monty Python,' not the snake.",
    "category": "tech",
    "emoji": "🐍"
  },
  {
    "content": "The first computer mouse was made of wood in **1964** by Douglas Engelbart.",
    "category": "tech",
    "emoji": "🖱️"
  },
  {
    "content": "The QWERTY keyboard layout was designed to slow typists down so typewriter keys wouldn't jam.",
    "category": "tech",
    "emoji": "⌨️"
  },
  {
    "content": "Domain name registration was completely free until **1995**.",
    "category": "tech",
    "emoji": "🏷️"
  },
  {
    "content": "Over 90% of the world's currency exists only in digital form on computer servers.",
    "category": "tech",
    "emoji": "💳"
  },
  {
    "content": "JavaScript was created in just **10 days** in 1995 by Brendan Eich.",
    "category": "tech",
    "emoji": "⚡"
  },
  {
    "content": "The first computer bug was a real moth found trapped in a Harvard Mark II computer relay in 1947.",
    "category": "tech",
    "emoji": "🪲"
  },
  {
    "content": "The average smartphone today has millions of times more computing power than all of NASA did in 1969.",
    "category": "tech",
    "emoji": "📱"
  },
  {
    "content": "The term 'robot' comes from a Czech word meaning 'forced labor.'",
    "category": "tech",
    "emoji": "🤖"
  },
  {
    "content": "The first electronic computer, ENIAC, weighed more than **27 tons** and took up 1,800 square feet.",
    "category": "tech",
    "emoji": "🎛️"
  },
  {
    "content": "About 30,000 websites are hacked every single day around the world.",
    "category": "tech",
    "emoji": "🛡️"
  },
  {
    "content": "The first email was sent in **1971** by Ray Tomlinson to himself.",
    "category": "tech",
    "emoji": "📧"
  },
  {
    "content": "Captain Crunch whistle could be used to make free long-distance phone calls in the 1970s.",
    "category": "tech",
    "emoji": "😙"
  },
  {
    "content": "GPS was originally created for military use before being opened to the public in the 1980s.",
    "category": "tech",
    "emoji": "🛰️"
  },
  {
    "content": "Linux runs 100% of the world's top 500 supercomputers.",
    "category": "tech",
    "emoji": "🐧"
  },
  {
    "content": "The concept of **zero** as a number and its arithmetic rules were first defined in India by Brahmagupta.",
    "category": "india",
    "emoji": "🇮🇳"
  },
  {
    "content": "Chess (originally called Chaturanga) was invented in India during the Gupta Empire in the 6th century.",
    "category": "india",
    "emoji": "♟️"
  },
  {
    "content": "Yoga originated in ancient India over **5,000 years ago**.",
    "category": "india",
    "emoji": "🧘"
  },
  {
    "content": "Takshashila, established around 700 BCE, is considered one of the world's earliest universities.",
    "category": "india",
    "emoji": "🏫"
  },
  {
    "content": "Mawsynram in Meghalaya, India, is the wettest inhabited place on Earth, receiving over 11,800 mm of rain annually.",
    "category": "india",
    "emoji": "🌧️"
  },
  {
    "content": "The Chail Cricket Ground in Himachal Pradesh is the highest cricket pitch in the world, at 2,444 meters.",
    "category": "india",
    "emoji": "🏏"
  },
  {
    "content": "Ladakh has a 'Magnetic Hill' that creates an optical illusion making cars appear to roll uphill.",
    "category": "india",
    "emoji": "⛰️"
  },
  {
    "content": "The word 'shampoo' comes from the Sanskrit word 'Champu,' which means to massage or press.",
    "category": "india",
    "emoji": "🧴"
  },
  {
    "content": "All wild white tigers in the world trace their ancestry back to a single tiger caught in India in 1951.",
    "category": "india",
    "emoji": "🐅"
  },
  {
    "content": "In 1963, India's first rocket was transported to the launch pad on a bicycle.",
    "category": "india",
    "emoji": "🚲"
  },
  {
    "content": "The Bandra-Worli Sea Link in Mumbai has steel wires equal to the Earth's circumference.",
    "category": "india",
    "emoji": "🌉"
  },
  {
    "content": "India is home to the world's only floating post office, located on Dal Lake in Srinagar.",
    "category": "india",
    "emoji": "✉️"
  },
  {
    "content": "Ayurveda is one of the oldest systems of medicine, originating in India over **3,000 years ago**.",
    "category": "india",
    "emoji": "🌿"
  },
  {
    "content": "India has the world's largest postal network, with over 150,000 post offices.",
    "category": "india",
    "emoji": "📮"
  },
  {
    "content": "The Kumbh Mela gathering is so large that it can be seen from space.",
    "category": "india",
    "emoji": "🎡"
  },
  {
    "content": "Rabindranath Tagore wrote the national anthems for both India and Bangladesh.",
    "category": "india",
    "emoji": "✍️"
  },
  {
    "content": "The game of Snakes and Ladders was created in ancient India to teach children about morals and karma.",
    "category": "india",
    "emoji": "🎲"
  },
  {
    "content": "Learning a new language can literally increase the size of your brain's hippocampus and cerebral cortex.",
    "category": "motivation",
    "emoji": "🗣️"
  },
  {
    "content": "Taking handwritten notes helps you learn and retain information much better than typing them.",
    "category": "motivation",
    "emoji": "✍️"
  },
  {
    "content": "Sleep plays a critical role in memory consolidation, transferring new information into long-term storage.",
    "category": "motivation",
    "emoji": "😴"
  },
  {
    "content": "Making mistakes triggers brain growth and neural connection reinforcement, meaning errors are vital for learning.",
    "category": "motivation",
    "emoji": "❌"
  },
  {
    "content": "The spacing effect shows that learning in small, spaced intervals is far more effective than cramming.",
    "category": "motivation",
    "emoji": "⏳"
  },
  {
    "content": "Teaching a concept to someone else helps you retain about 90% of that information.",
    "category": "motivation",
    "emoji": "🧑‍🏫"
  },
  {
    "content": "Regular physical exercise increases the production of proteins that support brain health and neurogenesis.",
    "category": "motivation",
    "emoji": "🏃"
  },
  {
    "content": "Listening to music can activate both the left and right hemispheres of the brain simultaneously.",
    "category": "motivation",
    "emoji": "🎵"
  },
  {
    "content": "High-density learning requires regular breaks; the Pomodoro Technique optimizes focus.",
    "category": "motivation",
    "emoji": "⏱️"
  },
  {
    "content": "Mentorship accelerates skill acquisition by up to 10 times compared to self-directed learning.",
    "category": "motivation",
    "emoji": "🤝"
  },
  {
    "content": "Over 80% of personal development comes from establishing small, consistent daily habits.",
    "category": "motivation",
    "emoji": "📈"
  },
  {
    "content": "Reading fiction increases empathy and emotional intelligence by simulating social experiences.",
    "category": "motivation",
    "emoji": "📚"
  },
  {
    "content": "Your brain has a 'neuroplasticity' feature, meaning it can adapt and grow at any age.",
    "category": "motivation",
    "emoji": "🧠"
  },
  {
    "content": "Setting specific, written goals increases your chance of achieving them by over 40%.",
    "category": "motivation",
    "emoji": "🎯"
  },
  {
    "content": "Deep breathing increases oxygen flow to the brain, instantly reducing stress and improving focus.",
    "category": "motivation",
    "emoji": "🧘"
  },
  {
    "content": "Consistency in practice is the single most important factor in mastering any complex skill.",
    "category": "motivation",
    "emoji": "🔄"
  },
  {
    "content": "The first computer programmer was Ada Lovelace in 1843 — over 100 years before modern computers existed.",
    "category": "tech",
    "emoji": "💻"
  },
  {
    "content": "The first website ever created is still online today. It was published by Tim Berners-Lee in 1991.",
    "category": "tech",
    "emoji": "🌐"
  },
  {
    "content": "Python is named after the comedy group Monty Python, not the snake.",
    "category": "tech",
    "emoji": "🐍"
  },
  {
    "content": "The average smartphone today has more computing power than NASA had during the Apollo 11 moon landing.",
    "category": "tech",
    "emoji": "📱"
  },
  {
    "content": "Many successful engineers wrote their first code as beginners without formal training.",
    "category": "career",
    "emoji": "🚀"
  },
  {
    "content": "Steve Jobs once said that connecting ideas from different fields creates innovation.",
    "category": "career",
    "emoji": "💡"
  },
  {
    "content": "Many tech founders built their first product while still learning the basics.",
    "category": "career",
    "emoji": "🔥"
  },
  {
    "content": "The most in-demand skill across all industries in 2025 is creative problem-solving.",
    "category": "career",
    "emoji": "🎯"
  },
  {
    "content": "The brain remembers information better when learning is spaced over time (the spacing effect).",
    "category": "brain",
    "emoji": "🧠"
  },
  {
    "content": "Taking short breaks improves concentration and creativity — your brain processes information during rest.",
    "category": "brain",
    "emoji": "☕"
  },
  {
    "content": "Teaching others helps you remember concepts 90% longer than just reading about them.",
    "category": "brain",
    "emoji": "📖"
  },
  {
    "content": "Your brain forms new neural connections every single time you learn something new.",
    "category": "brain",
    "emoji": "⚡"
  },
  {
    "content": "The human brain uses about 20% of the body's total energy despite being only 2% of body weight.",
    "category": "science",
    "emoji": "🔬"
  },
  {
    "content": "Octopuses have three hearts and blue blood.",
    "category": "science",
    "emoji": "🐙"
  },
  {
    "content": "There are more possible chess games than atoms in the observable universe.",
    "category": "science",
    "emoji": "♟️"
  },
  {
    "content": "The first bug in computing was literally a moth stuck in a computer relay at Harvard in 1947.",
    "category": "code",
    "emoji": "🪲"
  },
  {
    "content": "JavaScript was created in just 10 days by Brendan Eich in 1995.",
    "category": "code",
    "emoji": "⚡"
  },
  {
    "content": "The first version of Windows was released in 1985 and required only 256 KB of memory.",
    "category": "code",
    "emoji": "🪟"
  },
  {
    "content": "There are over 700 programming languages in the world. You only need to master a few!",
    "category": "code",
    "emoji": "🧑‍💻"
  },
  {
    "content": "Consistency matters more than intensity in skill building. Small daily steps beat rare marathons.",
    "category": "motivation",
    "emoji": "🌟"
  },
  {
    "content": "Many great inventions came from solving everyday problems — not from genius moments.",
    "category": "motivation",
    "emoji": "✨"
  },
  {
    "content": "The best way to learn something is to build something with it.",
    "category": "motivation",
    "emoji": "🛠️"
  },
  {
    "content": "Every expert was once a beginner. The only difference is they never stopped learning.",
    "category": "motivation",
    "emoji": "🏆"
  },
  {
    "content": "The world's quietest room is -20.3 dBA, so quiet you can hear your own heartbeat and bones grinding.",
    "category": "world",
    "emoji": "🤫"
  },
  {
    "content": "Glaciers and ice sheets hold about **69 percent** of the world's freshwater.",
    "category": "world",
    "emoji": "🏔️"
  },
  {
    "content": "The oceans hold about 96.5 percent of all Earth's water, covering 71 percent of the surface.",
    "category": "world",
    "emoji": "🌊"
  },
  {
    "content": "A day on Earth was only 18 hours long about **1.4 billion years ago**.",
    "category": "world",
    "emoji": "🕰️"
  },
  {
    "content": "There are more trees on Earth than stars in the Milky Way galaxy.",
    "category": "space",
    "emoji": "🌲"
  },
  {
    "content": "The Sun makes up **99.86 percent** of the total mass of the entire Solar System.",
    "category": "space",
    "emoji": "☀️"
  },
  {
    "content": "One day on Mercury lasts approximately **59 Earth days**.",
    "category": "space",
    "emoji": "🪐"
  },
  {
    "content": "The footprints on the moon will not disappear because there is no wind or water to erode them.",
    "category": "space",
    "emoji": "👣"
  },
  {
    "content": "A newborn panda is smaller than a mouse, weighing only about 100 grams.",
    "category": "animal",
    "emoji": "🐼"
  }
];

async function seedFacts() {
  console.log(`Starting to seed ${facts.length} interesting facts into table 'interesting_facts'...`);

  const { data, error } = await supabase
    .from('interesting_facts')
    .insert(facts);

  if (error) {
    console.error("Error seeding facts table:", error);
    process.exit(1);
  } else {
    console.log("Successfully seeded interesting facts into the database!");
    process.exit(0);
  }
}

seedFacts();
