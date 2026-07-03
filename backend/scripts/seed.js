const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Question = require('../models/Question');
const PlacementDrive = require('../models/PlacementDrive');
const Profile = require('../models/Profile');
const Practice = require('../models/Practice');
const Application = require('../models/Application');

dotenv.config();

const seed = async () => {
  try {
    console.log('Seeder script started...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal');
    console.log('MongoDB Connected: 127.0.0.1');

    // Clean up
    await User.deleteMany();
    await Profile.deleteMany();
    await Question.deleteMany();
    await Practice.deleteMany();
    await PlacementDrive.deleteMany();
    await Application.deleteMany();
    console.log('Cleared existing database entries.');

    // Seed Admin & Student
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@placement.com',
      password: 'adminPassword123',
      role: 'admin'
    });
    console.log('Admin account seeded: admin@placement.com / adminPassword123');

    const demoStudent = await User.create({
      name: 'Jane Doe',
      email: 'student@placement.com',
      password: 'studentPassword123',
      role: 'student'
    });
    console.log('Demo Student account seeded: student@placement.com / studentPassword123');

    // Seed Placement Drives
    const drives = [
      {
        companyName: 'TechCorp Solutions',
        jobRole: 'Frontend Developer',
        description: 'Looking for a passionate React developer with solid understanding of state management, responsive designs, and clean coding standards.',
        package: 12,
        criteria: {
          minCgpa: 8.0,
          requiredSkills: ['JavaScript', 'React.js', 'HTML5', 'CSS3', 'Tailwind CSS']
        },
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'CloudSystems Inc.',
        jobRole: 'Backend Engineer',
        description: 'Seeking a Node.js / Express backend developer proficient with MongoDB, database architecture, API security, and REST principles.',
        package: 15,
        criteria: {
          minCgpa: 8.5,
          requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'SQL/Databases', 'Git & GitHub']
        },
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'DataSolutions Group',
        jobRole: 'Full Stack Developer',
        description: 'Hiring a versatile Full Stack Developer capable of building UIs in React and scaling backend microservices in Node.',
        package: 18,
        criteria: {
          minCgpa: 8.2,
          requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Git & GitHub']
        },
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Google India',
        jobRole: 'Software Development Engineer I',
        description: 'Looking for computer science graduates with strong analytical minds, data structure mastery, and code complexity design skills.',
        package: 32,
        criteria: {
          minCgpa: 9.0,
          requiredSkills: ['JavaScript', 'C++', 'Java', 'Python', 'Data Structures', 'Algorithms']
        },
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Microsoft Corporation',
        jobRole: 'Azure Cloud Specialist',
        description: 'Work on building highly scalable Azure services, managing server clusters, and handling global virtualized infrastructure networks.',
        package: 28,
        criteria: {
          minCgpa: 8.8,
          requiredSkills: ['Python', 'Go', 'Docker', 'Kubernetes', 'Cloud Computing', 'Linux']
        },
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Amazon Web Services',
        jobRole: 'Systems Development Engineer',
        description: 'Join the core database engines team to support cloud transaction scaling, latency optimization, and data durability mechanisms.',
        package: 24,
        criteria: {
          minCgpa: 8.5,
          requiredSkills: ['C++', 'Java', 'Linux', 'SQL/Databases', 'Bash Scripting', 'Networking']
        },
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Meta Technologies',
        jobRole: 'Product Software Architect',
        description: 'Build product flows across Instagram and WhatsApp messaging hubs, scaling user sessions to millions of concurrent requests.',
        package: 35,
        criteria: {
          minCgpa: 9.2,
          requiredSkills: ['JavaScript', 'React.js', 'Node.js', 'GraphQL', 'System Design', 'NoSQL']
        },
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Netflix Streaming',
        jobRole: 'Security Infrastructure Engineer',
        description: 'Audit network flow security pipelines, encrypt content files, and design access keys control mechanisms globally.',
        package: 30,
        criteria: {
          minCgpa: 8.9,
          requiredSkills: ['Python', 'Rust', 'Cryptography', 'Linux', 'Security Architecture', 'Git']
        },
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Adobe Systems',
        jobRole: 'Computer Scientist I',
        description: 'Improve cloud documents processing libraries, PDF compression metrics, and digital canvas rendering speeds.',
        package: 22,
        criteria: {
          minCgpa: 8.3,
          requiredSkills: ['C++', 'JavaScript', 'HTML5', 'CSS3', 'WebGL', 'Algorithms']
        },
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Apple Operations',
        jobRole: 'Embedded Firmware Developer',
        description: 'Write real-time operating systems firmware for audio devices, testing low-level controls, driver links, and memory layouts.',
        package: 26,
        criteria: {
          minCgpa: 8.7,
          requiredSkills: ['C', 'Assembly', 'Microcontrollers', 'Embedded Systems', 'Debugging', 'Hardware']
        },
        deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Uber Technologies',
        jobRole: 'Realtime Dispatch Engineer',
        description: 'Improve geolocation routing lookups, driver match heuristics, and dynamic pricing evaluation speed.',
        package: 25,
        criteria: {
          minCgpa: 8.6,
          requiredSkills: ['Go', 'Java', 'APIs/Endpoints', 'SQL/Databases', 'Redis', 'Algorithms']
        },
        deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        companyName: 'Stripe Payments',
        jobRole: 'API Integration Architect',
        description: 'Build safe developer payment flows, compliance pipelines, fraud indicators, and double-entry transaction databases.',
        package: 27,
        criteria: {
          minCgpa: 8.8,
          requiredSkills: ['Ruby', 'JavaScript', 'Node.js', 'APIs/Endpoints', 'Cryptography', 'SQL/Databases']
        },
        deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        status: 'active'
      }
    ];

    await PlacementDrive.insertMany(drives);
    console.log('Seeded placement drives.');

    // Seed Aptitude Questions
    const aptitudeQuestions = [
      // 1. Quantitative Aptitude (12 questions)
      {
        title: 'Train Speed and Distance',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        content: 'A train 120 meters long passes a telegraph post in 6 seconds. What is the speed of the train in km/hr?',
        options: ['72 km/hr', '60 km/hr', '80 km/hr', '64 km/hr'],
        correctOption: 0,
        hints: ['Speed = Distance / Time. Multiply speed in m/s by 18/5 to get km/h.']
      },
      {
        title: 'Work and Efficiency',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        content: 'A can complete a piece of work in 12 days and B can do it in 15 days. If they work together, how many days will they take to finish the work?',
        options: ['6 days', '6.66 days', '7 days', '5.55 days'],
        correctOption: 1,
        hints: ['Find their 1-day work efficiencies: 1/12 and 1/15. Add them together and invert.']
      },
      {
        title: 'Simple Interest',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        content: 'A sum of money at simple interest amounts to $815 in 3 years and to $854 in 4 years. What is the sum?',
        options: ['$650', '$690', '$698', '$700'],
        correctOption: 2,
        hints: ['Subtract the 3-year amount from the 4-year amount to get 1 year of interest. Then subtract 3 years of interest from $815.']
      },
      {
        title: 'Profit and Loss markup',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        content: 'A shopkeeper sells a product for $240 at a loss of 20%. At what price should he sell it to gain 20%?',
        options: ['$300', '$320', '$360', '$400'],
        correctOption: 2,
        hints: ['Find Cost Price (CP) first: CP = 240 / 0.8. Then find Selling Price for 20% gain: SP = CP * 1.2.']
      },
      {
        title: 'Average Speed Calculation',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        content: 'A motorist travels from town X to town Y at an average speed of 40 km/h, and returns at an average speed of 60 km/h. What is his average speed for the round trip?',
        options: ['48 km/h', '50 km/h', '45 km/h', '52 km/h'],
        correctOption: 0,
        hints: ['Use the formula for average speed of equal distances: 2xy / (x + y).']
      },
      {
        title: 'Ratio and Proportions mix',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        content: 'In a mixture of 60 liters, the ratio of milk and water is 2:1. If this ratio is to be 1:2, how many liters of water should be added?',
        options: ['20 liters', '30 liters', '40 liters', '60 liters'],
        correctOption: 3,
        hints: ['Initial milk = 40L, water = 20L. In the new mixture, water must be double the milk.']
      },
      {
        title: 'Permutations arrangement',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'hard',
        content: 'In how many ways can the letters of the word "LEADER" be arranged?',
        options: ['720', '360', '120', '180'],
        correctOption: 1,
        hints: ['Count the total letters and divide by the factorial of repeating letters. Arrangement = 6! / 2!.']
      },
      {
        title: 'Card Probability',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        content: 'From a pack of 52 cards, two cards are drawn together at random. What is the probability that both the cards are kings?',
        options: ['1/221', '2/221', '1/13', '2/13'],
        correctOption: 0,
        hints: ['Number of ways of drawing 2 kings out of 4 is 4C2. Total ways of drawing 2 cards out of 52 is 52C2.']
      },
      {
        title: 'Pipes and Cisterns',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        content: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?',
        options: ['10 mins', '12 mins', '15 mins', '25 mins'],
        correctOption: 1,
        hints: ['Add their 1-minute filling capabilities: 1/20 + 1/30 = 5/60 = 1/12. Invert to get 12 minutes.']
      },
      {
        title: 'Boats and Streams',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'hard',
        content: 'A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.',
        options: ['3 hours', '4 hours', '5 hours', '6 hours'],
        correctOption: 1,
        hints: ['Downstream speed = Boat speed + Stream speed = 13 + 4 = 17 km/hr. Time = Distance / Speed.']
      },
      {
        title: 'Compound Interest',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'hard',
        content: 'Find the compound interest on $10,000 for 2 years at 10% per annum, compounded annually.',
        options: ['$2,000', '$2,100', '$2,200', '$1,900'],
        correctOption: 1,
        hints: ['Compound Interest = Principal * (1 + R/100)^T - Principal.']
      },
      {
        title: 'Divisibility Rules',
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        content: 'Which of the following numbers is completely divisible by 9?',
        options: ['29034', '34902', '58123', '10983'],
        correctOption: 0,
        hints: ['If the sum of all digits of a number is divisible by 9, the number is divisible by 9.']
      },

      // 2. Logical Reasoning (12 questions)
      {
        title: 'Letter Series Coding',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'Look at this series: U32, V29, __, X23, Y20. What number should fill the blank?',
        options: ['W26', 'W17', 'Z26', 'W25'],
        correctOption: 0,
        hints: ['Alphabet increases by 1 step. Numbers decrease by 3.']
      },
      {
        title: 'Blood Relations puzzle',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'medium',
        content: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
        options: ['His son\'s', 'His nephew\'s', 'His own', 'His father\'s'],
        correctOption: 0,
        hints: ['"My father\'s son" is the man himself. So the photograph is of the man\'s son.']
      },
      {
        title: 'Coding & Sequences',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'In a code language, if "COMPUTER" is written as "RFUVQNPC", how will "MEDICINE" be written?',
        options: ['EOJDEJFM', 'EOJDJEFM', 'MFEJDJOE', 'DJEOJFM'],
        correctOption: 1,
        hints: ['Examine the first and last letters. Notice the reverse order with letters shifted by one.']
      },
      {
        title: 'Syllogism Deduction',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'medium',
        content: 'Statements: (1) All dogs are books. (2) All books are pictures. Conclusions: [I] All dogs are pictures. [II] All pictures are books.',
        options: ['Only I follows', 'Only II follows', 'Both I & II follow', 'Neither follows'],
        correctOption: 0,
        hints: ['Since Dogs are subset of Books, and Books are subset of Pictures, all Dogs must be Pictures.']
      },
      {
        title: 'Direction Sense Test',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'A man walks 2 km North, then turns East and walks 10 km. After this he turns North and walks 4 km. How far is he from his starting point?',
        options: ['12 km', '10.5 km', '10.77 km', '11.66 km'],
        correctOption: 2,
        hints: ['Total vertical distance = 2 + 4 = 6 km. Total horizontal distance = 10 km. Distance = sqrt(6^2 + 10^2).']
      },
      {
        title: 'Linear Seating arrangement',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'medium',
        content: 'Five friends P, Q, R, S, T are sitting in a row facing North. S is sitting between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the middle?',
        options: ['P', 'Q', 'S', 'T'],
        correctOption: 2,
        hints: ['Work out the positions from left to right: P -> T -> S -> Q -> R.']
      },
      {
        title: 'Clock Angles',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'hard',
        content: 'What is the angle between the hour hand and the minute hand of a clock at 3:40?',
        options: ['130 degrees', '125 degrees', '140 degrees', '120 degrees'],
        correctOption: 0,
        hints: ['Use the formula: Angle = |(30 * H) - (5.5 * M)| where H = 3 and M = 40.']
      },
      {
        title: 'Calendar calculations',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'hard',
        content: 'It was Sunday on Jan 1, 2006. What was the day of the week on Jan 1, 2010?',
        options: ['Sunday', 'Friday', 'Saturday', 'Monday'],
        correctOption: 1,
        hints: ['Count the number of odd days. From 2006 to 2010, there are 3 ordinary years and 1 leap year (2008). 3 + 2 = 5 odd days.']
      },
      {
        title: 'Statement & Assumptions',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'medium',
        content: 'Statement: "Buy our product to reduce wrinkles in 2 weeks" - An advertisement. Assumptions: [I] Wrinkles can be reduced in 2 weeks. [II] People want wrinkles reduced.',
        options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither follows'],
        correctOption: 2,
        hints: ['An advertiser assumes their claim is possible and that people are interested in the benefit.']
      },
      {
        title: 'Word Analogy',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'Cup is to Lip as Bird is to __?',
        options: ['Grass', 'Forest', 'Beak', 'Bush'],
        correctOption: 2,
        hints: ['One drinks from a cup using lips; a bird gathers or eats using its beak.']
      },
      {
        title: 'Odd One Out',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'Find the odd one out of these terms: Geometry, Algebra, Arithmetic, Geography.',
        options: ['Geometry', 'Algebra', 'Arithmetic', 'Geography'],
        correctOption: 3,
        hints: ['Geometry, Algebra, and Arithmetic are branches of Mathematics. Geography is a social science.']
      },
      {
        title: 'Number Series Pattern',
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        content: 'Find the next number in the series: 3, 5, 9, 17, 33, __.',
        options: ['48', '65', '56', '60'],
        correctOption: 1,
        hints: ['The difference between consecutive terms doubles each time: +2, +4, +8, +16, +32.']
      },

      // 3. Verbal Ability (12 questions)
      {
        title: 'Synonym selection',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Choose the correct synonym of the word "ABANDON".',
        options: ['Retain', 'Forsake', 'Adopt', 'Protect'],
        correctOption: 1,
        hints: ['Abandon means to leave or desert. Forsake shares this definition.']
      },
      {
        title: 'Antonym matching',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Choose the correct antonym of the word "FRAGILE".',
        options: ['Delicate', 'Robust', 'Brittle', 'Weak'],
        correctOption: 1,
        hints: ['Fragile means easily broken or weak. The opposite is strong or robust.']
      },
      {
        title: 'Sentence Correction syntax',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'medium',
        content: 'Find the grammatically correct option: "Every one of the students __ passed the exam."',
        options: ['have', 'has', 'were having', 'are'],
        correctOption: 1,
        hints: ['"Every one" is a singular pronoun and requires a singular verb: "has".']
      },
      {
        title: 'Fill in the Blanks grammar',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Fill in the blank: "She is proficient __ coding in Python."',
        options: ['in', 'at', 'with', 'for'],
        correctOption: 0,
        hints: ['We say "proficient in" a skill or subject.']
      },
      {
        title: 'Idioms and Phrases',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'medium',
        content: 'What is the meaning of the idiom: "Spill the beans"?',
        options: ['To drop food', 'To reveal a secret prematurely', 'To work hard', 'To make a mistake'],
        correctOption: 1,
        hints: ['To spill the beans means to give away confidential information.']
      },
      {
        title: 'One Word Substitution',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Provide a single word for: "A person who writes books or articles."',
        options: ['Auditor', 'Author', 'Actor', 'Artist'],
        correctOption: 1,
        hints: ['An author writes books, articles, or papers.']
      },
      {
        title: 'Active to Passive Voice',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'medium',
        content: 'Change the voice: "The chef cooked a delicious meal."',
        options: ['A delicious meal is cooked by the chef.', 'A delicious meal was cooked by the chef.', 'The chef was cooking a delicious meal.', 'A delicious meal had been cooked by the chef.'],
        correctOption: 1,
        hints: ['Simple past tense in active becomes "was/were + past participle" in passive voice.']
      },
      {
        title: 'Comprehension logical reasoning',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'hard',
        content: 'Read and deduce: "John is taller than Peter. Dave is shorter than Peter. Who is the tallest?"',
        options: ['John', 'Peter', 'Dave', 'Cannot be determined'],
        correctOption: 0,
        hints: ['Logical hierarchy: John > Peter > Dave. So John is the tallest.']
      },
      {
        title: 'Spell Check accuracy',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Identify the correctly spelled word.',
        options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomodate'],
        correctOption: 1,
        hints: ['Accommodate has double "c" and double "m".']
      },
      {
        title: 'Paragraph Ordering sequence',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'hard',
        content: 'Arrange in order: [P] He was very hungry. [Q] He found a restaurant. [R] He ordered food. [S] He sat down.',
        options: ['PQSR', 'PQRS', 'PSQR', 'PRSQ'],
        correctOption: 0,
        hints: ['Hunger (P) leads to finding a place (Q), sitting down (S), and then ordering (R).']
      },
      {
        title: 'Prepositions insertion',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Choose the correct preposition: "The child was hiding __ the bed."',
        options: ['under', 'over', 'into', 'upon'],
        correctOption: 0,
        hints: ['Hiding places below furniture are described as "under".']
      },
      {
        title: 'Analogy Word Links',
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        content: 'Doctor is to Hospital as Teacher is to __?',
        options: ['School', 'Market', 'Court', 'Station'],
        correctOption: 0,
        hints: ['A doctor works in a hospital; a teacher works in a school.']
      },

      // 4. Data Interpretation (12 questions)
      {
        title: 'Bar Chart Sales Growth',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'A bar chart shows sales of $50k in 2021, $75k in 2022, and $90k in 2023. What is the percentage increase in sales from 2021 to 22?',
        options: ['50%', '30%', '25%', '60%'],
        correctOption: 0,
        hints: ['Percentage increase = ((Sales 2022 - Sales 2021) / Sales 2021) * 100.']
      },
      {
        title: 'Pie Chart Budget Distribution',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'easy',
        content: 'In a company budget pie chart, 30% goes to R&D, 40% to Marketing, and 30% to Sales. If the total budget is $100,000, how much goes to Marketing?',
        options: ['$30,000', '$40,000', '$10,000', '$25,000'],
        correctOption: 1,
        hints: ['Marketing share = 40% of $100,000 = 0.40 * 100000.']
      },
      {
        title: 'Line Graph production rates',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'A line graph tracks monthly toy production: Jan (2000), Feb (1800), Mar (2200), Apr (2400). What is the average monthly toy production?',
        options: ['2100', '2200', '2000', '2300'],
        correctOption: 0,
        hints: ['Average = (Sum of toy counts for all months) / number of months. (2000+1800+2200+2400)/4.']
      },
      {
        title: 'Table Chart Population Census',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'A table shows population of City A: Males (400k), Females (350k). City B: Males (300k), Females (320k). Which city has a higher sex ratio (Females/Males)?',
        options: ['City B', 'City A', 'Both equal', 'Cannot determine'],
        correctOption: 0,
        hints: ['City A ratio = 350/400 = 0.875. City B ratio = 320/300 = 1.06.']
      },
      {
        title: 'Combined Index Graph',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'hard',
        content: 'A combined graph shows cost price index (120) and selling price index (150). What is the profit margin percentage based on these index numbers?',
        options: ['25%', '20%', '30%', '15%'],
        correctOption: 0,
        hints: ['Margin = ((SP index - CP index) / CP index) * 100 = (30 / 120) * 100.']
      },
      {
        title: 'Radar Chart evaluation',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'A radar chart rates Candidate A as 8/10 in coding, 6/10 in logic, 7/10 in verbal. Candidate B as 7/10, 8/10, 6/10. Who has the highest overall total rating score?',
        options: ['Both are equal', 'Candidate A', 'Candidate B', 'None of these'],
        correctOption: 0,
        hints: ['Sum ratings for both: A = 8+6+7 = 21. B = 7+8+6 = 21.']
      },
      {
        title: 'Table profit margins comparison',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'easy',
        content: 'Product X: revenue $200, cost $150. Product Y: revenue $300, cost $250. Which product has a higher profit percentage relative to cost?',
        options: ['Product X', 'Product Y', 'Both equal', 'Cannot tell'],
        correctOption: 0,
        hints: ['Product X profit = 50/150 = 33.3%. Product Y profit = 50/250 = 20%.']
      },
      {
        title: 'Pie Chart expense division',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'Family expenses pie chart has rent (120 degrees). If total monthly expense is $3000, what is the rent expense?',
        options: ['$1000', '$1200', '$800', '$1500'],
        correctOption: 0,
        hints: ['Rent fraction = 120 degrees out of 360 degrees = 1/3 of total budget.']
      },
      {
        title: 'Bar Chart Rainfall Metrics',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'easy',
        content: 'Rainfall in mm: Mon (10), Tue (0), Wed (20), Thu (15). What is the total rainfall?',
        options: ['45 mm', '30 mm', '40 mm', '50 mm'],
        correctOption: 0,
        hints: ['Simply add the values for all days: 10 + 0 + 20 + 15.']
      },
      {
        title: 'Line Graph Stock Prices',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        content: 'Stock price drops from $100 to $80. What is the percentage drop?',
        options: ['20%', '25%', '15%', '30%'],
        correctOption: 0,
        hints: ['Drop percentage = ((Original - New) / Original) * 100 = (20 / 100) * 100.']
      },
      {
        title: 'Table student marks assessment',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'easy',
        content: 'Student scores: Math (80/100), Science (90/100). What is the aggregate percentage score?',
        options: ['85%', '90%', '80%', '95%'],
        correctOption: 0,
        hints: ['Aggregate = ((80 + 90) / 200) * 100 = 170/200 * 100.']
      },
      {
        title: 'Pie Chart energy sources',
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'hard',
        content: 'A city uses coal (50%), gas (30%), solar (20%). If total power is 500 MW, how many MW is solar power?',
        options: ['100 MW', '150 MW', '50 MW', '200 MW'],
        correctOption: 0,
        hints: ['Solar power = 20% of 500 MW = 0.20 * 500.']
      },

      // 5. Data Sufficiency (12 questions)
      {
        title: 'DS on Age comparison',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'What is John\'s current age?\n[I] John is 5 years older than Dave.\n[II] Dave was born 15 years ago.\nDecide if statements are sufficient.',
        options: ['Statement I & II together are sufficient', 'I alone is sufficient', 'II alone is sufficient', 'Statements are not sufficient'],
        correctOption: 0,
        hints: ['From II, we find Dave is 15. From I, John is 15 + 5 = 20. Both together are required.']
      },
      {
        title: 'DS on Speed and Time',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'How long did the motorist take to cover 100 km?\n[I] His average speed was 50 km/h.\n[II] He stopped for 15 minutes midway.\nDecide if statements are sufficient.',
        options: ['Statement I alone is sufficient', 'Statement I & II together are sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 1,
        hints: ['We need speed to calculate drive time (2 hours), and statement II to add stop duration (2.25 hours total).']
      },
      {
        title: 'DS on Geometry Area',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'hard',
        content: 'What is the area of the right-angled triangle?\n[I] The hypotenuse is 10 cm.\n[II] The base is 6 cm.\nDecide if statements are sufficient.',
        options: ['Statements I and II together are sufficient', 'Statement I alone is sufficient', 'Statement II alone is sufficient', 'Statements are not sufficient'],
        correctOption: 0,
        hints: ['To find area, we need base and height. Height can be found using hypotenuse (10) and base (6) via Pythagoras.']
      },
      {
        title: 'DS on Number properties',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'easy',
        content: 'Is integer X odd?\n[I] X is divisible by 2.\n[II] X is a multiple of 5.\nDecide if statements are sufficient.',
        options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Both together are sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['If X is divisible by 2, it is even, so it is NOT odd. Statement I alone resolves this question with a definite "No".']
      },
      {
        title: 'DS on Average calculation',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'What is the average height of 3 boys?\n[I] The tallest boy is 180 cm.\n[II] The sum of heights of the other two boys is 320 cm.',
        options: ['Statements I and II together are sufficient', 'Statement I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['To find average, we need sum of all three heights. Sum = 180 + 320 = 500 cm.']
      },
      {
        title: 'DS on Profit Percentage',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'What was the profit percentage of the sale of a laptop?\n[I] The selling price was $800.\n[II] The cost price was $600.',
        options: ['Statements I and II together are sufficient', 'Statement I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['Profit % = ((SP - CP) / CP) * 100. We need both SP and CP to calculate this.']
      },
      {
        title: 'DS on Ratio Composition',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'easy',
        content: 'Find the total number of students in a class.\n[I] The ratio of boys to girls is 3:2.\n[II] There are 12 girls in the class.',
        options: ['Statements I and II together are sufficient', 'I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['From ratio 3:2, boys = (3/2) * girls. With girls = 12, boys = 18. Total = 30. Both are needed.']
      },
      {
        title: 'DS on Simple Interest Variables',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'What interest rate is charged on a loan of $5000?\n[I] The simple interest for 3 years is $600.\n[II] The total repayment amount is $5600.',
        options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Either statement I or II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['Interest rate SI = (P * R * T) / 100. With SI = 600, P = 5000, and T = 3, we can solve for R.']
      },
      {
        title: 'DS on Coding-Decoding',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'easy',
        content: 'What does "sky" mean in the code language?\n[I] "sky is blue" is coded as "1 2 3".\n[II] "is blue deep" is coded as "2 3 4".',
        options: ['Statements I and II together are sufficient', 'Statement I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['Compare both codes. Common terms "is blue" are coded as "2" and "3". So "sky" must be coded as "1".']
      },
      {
        title: 'DS on Work Completion Days',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'In how many days can A and B complete a task working together?\n[I] A can complete the task in 10 days.\n[II] B takes 15 days to do the same task.',
        options: ['Statements I and II together are sufficient', 'Statement I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['Both speeds are needed to calculate combined work speed.']
      },
      {
        title: 'DS on Sitting Orders',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        content: 'Who is sitting on the immediate left of Dave?\n[I] Alice sits adjacent to Dave.\n[II] Bob sits on the immediate right of Dave.',
        options: ['Statements are not sufficient', 'Statements I and II together are sufficient', 'I alone is sufficient', 'II alone is sufficient'],
        correctOption: 0,
        hints: ['"Immediate left" is not resolved because statement I only says adjacent (which could be left or right).']
      },
      {
        title: 'DS on Circle Radius',
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'easy',
        content: 'What is the radius of the circle?\n[I] The circumference is 44 cm.\n[II] The area is 154 sq. cm.',
        options: ['Either statement I or II alone is sufficient', 'Statement I alone is sufficient', 'II alone is sufficient', 'Neither sufficient'],
        correctOption: 0,
        hints: ['Circumference = 2*pi*r, so r can be found from I. Area = pi*r^2, so r can be found from II. Either is sufficient.']
      },

      // 6. Analytical Reasoning (12 questions)
      {
        title: 'Matrix Arrangement Puzzle',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'Three guys X, Y, Z wear caps of Red, Blue, Green colors. X wears a Red cap. Y does not wear a Blue cap. What color cap does Z wear?',
        options: ['Blue', 'Green', 'Red', 'Cannot determine'],
        correctOption: 0,
        hints: ['X is Red. Y is not Blue, so Y must be Green. Z must therefore be Blue.']
      },
      {
        title: 'Grouping and Selection',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'hard',
        content: 'A team of 3 must be selected from P, Q, R, S. If P is selected, Q cannot be selected. If S is selected, R must be selected. If P is chosen, who must fill the rest of the slots?',
        options: ['R and S', 'Q and R', 'Q and S', 'None of these'],
        correctOption: 0,
        hints: ['P is selected, so Q is excluded. Remaining candidates are R and S. Since we need a team of 3, the team must be P, R, and S.']
      },
      {
        title: 'Linear Sequencing Ranking',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'easy',
        content: 'In a race, Tom finished before Harry but after Dick. Who won the race?',
        options: ['Dick', 'Tom', 'Harry', 'Cannot tell'],
        correctOption: 0,
        hints: ['Order of finish: Dick -> Tom -> Harry. Dick is the winner.']
      },
      {
        title: 'Network Path Connectivity',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'Town A connects to B. Town B connects to C and D. Town C connects to E. How many distinct routes connect Town A to Town E?',
        options: ['1 route', '2 routes', '3 routes', 'No routes'],
        correctOption: 0,
        hints: ['Trace the connections: A -> B -> C -> E. There is only 1 path.']
      },
      {
        title: 'Truth-teller and Liar puzzle',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'hard',
        content: 'A says: "I am a liar." Is A a truth-teller or a liar?',
        options: ['This is a logical paradox', 'A is a truth-teller', 'A is a liar', 'None of these'],
        correctOption: 0,
        hints: ['If A is telling the truth, then A is a liar (contradiction). If A is lying, then the statement is false, meaning A is not a liar (contradiction).']
      },
      {
        title: 'Venn Diagram logic',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'easy',
        content: 'All apples are fruits. Some fruits are sweet. Which Venn diagram represents this?',
        options: ['Apples inside Fruits, sweet overlapping Fruits', 'Apples and sweet inside Fruits', 'Apples overlapping sweet, separate from Fruits', 'None of these'],
        correctOption: 0,
        hints: ['Apples is a subset of Fruits. Sweet overlaps with Fruits (and potentially Apples).']
      },
      {
        title: 'Scheduling Constraints Calendar',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'Lecture X must be scheduled on Monday or Tuesday. Lecture Y must be scheduled after X. On what day can Y be scheduled?',
        options: ['Tuesday or later', 'Monday only', 'Wednesday only', 'None of these'],
        correctOption: 0,
        hints: ['If X is Monday, Y can be Tuesday onwards. If X is Tuesday, Y can be Wednesday onwards.']
      },
      {
        title: 'Machine Input-Output',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'hard',
        content: 'Input: 40, 10, 50, 30. Step 1: 10, 40, 50, 30. Step 2: 10, 30, 40, 50. What algorithm is the machine executing?',
        options: ['Ascending sorting', 'Descending sorting', 'Reverse input', 'None of these'],
        correctOption: 0,
        hints: ['The steps gradually arrange the numbers from smallest to largest.']
      },
      {
        title: 'Course of Action decision',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'Problem: High traffic congestion in the city. Courses of action: [I] Restrict new car registrations. [II] Build flyovers and widen roads.',
        options: ['Only II is a practical course of action', 'Only I is practical', 'Both I and II are practical', 'Neither follows'],
        correctOption: 0,
        hints: ['Restricting sales is highly extreme and bad for economy. Road infrastructure upgrades are standard traffic solutions.']
      },
      {
        title: 'Cause and Effect correlation',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'Statement [I]: Farmers are shifting to organic farming. [II]: Consumers are demanding chemical-free vegetables.',
        options: ['II is the cause and I is the effect', 'I is the cause and II is the effect', 'Both are independent causes', 'Both are effects of independent causes'],
        correctOption: 0,
        hints: ['The demand from consumers (cause) motivates farmers to change their crops (effect).']
      },
      {
        title: 'Team Selection Composition',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'hard',
        content: 'A panel of 4 contains 2 engineers and 2 doctors. Candidates: Engg (A, B, C), Doctors (D, E, F). If A is selected, D is excluded. If E is chosen, B must be chosen. If A and E are selected, who are the other two?',
        options: ['B and F', 'B and C', 'C and F', 'None of these'],
        correctOption: 0,
        hints: ['A is Engg (selected). E is Doctor (selected). Since E is selected, B (Engg) must be selected. D is excluded. Remaining Doctor must be F. So team is A, E, B, F.']
      },
      {
        title: 'Coding Grid Coordinates',
        type: 'aptitude',
        category: 'Analytical Reasoning',
        difficulty: 'medium',
        content: 'In a grid, moving Right is +1 X, and moving Up is +1 Y. If you start at (2, 3), move 2 units Right and 3 units Down, where are you?',
        options: ['(4, 0)', '(0, 6)', '(4, 6)', '(2, 0)'],
        correctOption: 0,
        hints: ['X coordinate: 2 + 2 = 4. Y coordinate: 3 - 3 = 0. New coordinate is (4, 0).']
      }
    ];

    // Seed Interview Prompts
    const interviewPrompts = [
      // 1. Frontend Developer (4 questions)
      {
        title: 'State vs Props in React',
        type: 'interview',
        category: 'Frontend Developer',
        difficulty: 'medium',
        content: 'Explain the difference between state and props in React.js, and how data flows.',
        hints: ['State represents internal mutable component data. Props represent external read-only configuration passed from parent.']
      },
      {
        title: 'Virtual DOM Mechanics',
        type: 'interview',
        category: 'Frontend Developer',
        difficulty: 'hard',
        content: 'What is the Virtual DOM, and how does React use diffing and reconciliation to optimize updates?',
        hints: ['React creates a lightweight in-memory representation, runs a diffing algorithm, and patches only the changed real DOM nodes.']
      },
      {
        title: 'CSS Box Model',
        type: 'interview',
        category: 'Frontend Developer',
        difficulty: 'easy',
        content: 'Explain the CSS Box Model. What is the difference between content-box and border-box sizing?',
        hints: ['Box model consists of content, padding, border, and margin. border-box includes padding and border in the specified width.']
      },
      {
        title: 'JavaScript Event Delegation',
        type: 'interview',
        category: 'Frontend Developer',
        difficulty: 'medium',
        content: 'What is Event Delegation in JavaScript? Explain how it uses event bubbling.',
        hints: ['Attaching a single event listener to a parent element to manage events bubbling up from children.']
      },

      // 2. Backend Engineer (4 questions)
      {
        title: 'REST API Design Principles',
        type: 'interview',
        category: 'Backend Engineer',
        difficulty: 'medium',
        content: 'What are the main constraints and principles of RESTful APIs?',
        hints: ['Statelessness, Client-Server architecture, Uniform Interface, Layered System.']
      },
      {
        title: 'SQL vs NoSQL Databases',
        type: 'interview',
        category: 'Backend Engineer',
        difficulty: 'medium',
        content: 'Explain the differences between relational (SQL) and non-relational (NoSQL) databases. When would you choose one over the other?',
        hints: ['SQL has predefined schema and ACID properties. NoSQL is schema-less and horizontally scalable.']
      },
      {
        title: 'ExpressJS Middleware Flow',
        type: 'interview',
        category: 'Backend Engineer',
        difficulty: 'easy',
        content: 'What is middleware in Express.js? Explain the role of the next() function.',
        hints: ['Functions that execute during the lifecycle of a request to modify req/res objects or end the cycle. next() passes control to the next handler.']
      },
      {
        title: 'Secure Password Storage',
        type: 'interview',
        category: 'Backend Engineer',
        difficulty: 'hard',
        content: 'How do you securely store user passwords in a backend database? Explain hashing and salting.',
        hints: ['Passwords should never be stored in plain text. Use bcrypt or Argon2 to hash them with a unique salt to prevent rainbow table attacks.']
      },

      // 3. Full Stack Developer (4 questions)
      {
        title: 'HTTP Request Lifecycle',
        type: 'interview',
        category: 'Full Stack Developer',
        difficulty: 'medium',
        content: 'Describe the complete lifecycle of a HTTP request from typing a URL in the browser to retrieving database records.',
        hints: ['DNS resolution, TCP/TLS handshake, HTTP request sending, Web server proxy routing, Application logic running, SQL query, and JSON rendering.']
      },
      {
        title: 'Resolving CORS Policies',
        type: 'interview',
        category: 'Full Stack Developer',
        difficulty: 'medium',
        content: 'What is CORS (Cross-Origin Resource Sharing), and how does a developer resolve CORS errors?',
        hints: ['A security mechanism that restricts resources loaded from another origin. Solved by setting access-control headers on the server.']
      },
      {
        title: 'CSR vs SSR in NextJS',
        type: 'interview',
        category: 'Full Stack Developer',
        difficulty: 'hard',
        content: 'Compare client-side rendering (CSR) and server-side rendering (SSR) in modern web development frameworks.',
        hints: ['CSR delivers blank HTML and builds UI in the browser. SSR renders pages on the server and delivers fully populated HTML.']
      },
      {
        title: 'Web Application Vulnerabilities',
        type: 'interview',
        category: 'Full Stack Developer',
        difficulty: 'hard',
        content: 'How do you secure web applications against SQL Injection (SQLi) and Cross-Site Scripting (XSS)?',
        hints: ['Use parameterized queries or ORMs for SQLi. Sanitize inputs and set proper Content Security Policies (CSP) for XSS.']
      },

      // 4. Data Analyst (4 questions)
      {
        title: 'SQL Joins and Window Functions',
        type: 'interview',
        category: 'Data Analyst',
        difficulty: 'medium',
        content: 'Explain the difference between Row_Number(), Rank(), and Dense_Rank() window functions in SQL with an example.',
        hints: ['Row_Number assigns unique serial numbers. Rank skips rank indices on ties. Dense_Rank does not skip rank indices on ties.']
      },
      {
        title: 'Handling Missing Values',
        type: 'interview',
        category: 'Data Analyst',
        difficulty: 'easy',
        content: 'How do you handle missing values or outliers in a dataset before conducting your analysis?',
        hints: ['Imputation using mean/median/mode, deleting rows, or treating missing entries as a separate category.']
      },
      {
        title: 'A/B Testing significance',
        type: 'interview',
        category: 'Data Analyst',
        difficulty: 'hard',
        content: 'How do you design an A/B test for a new feature launch, and how do you calculate statistical significance (p-value)?',
        hints: ['Hypothesis formulation, splitting traffic, selecting sample sizes, and choosing t-test or z-test thresholds.']
      },
      {
        title: 'Structured vs Unstructured Data',
        type: 'interview',
        category: 'Data Analyst',
        difficulty: 'easy',
        content: 'What is the difference between structured and unstructured data, and how do analysts approach unstructured formats?',
        hints: ['Structured data resides in fixed tables/databases. Unstructured includes logs, text, images, handled via NLP/RegEx.']
      },

      // 5. AI/ML Engineer (4 questions)
      {
        title: 'Supervised vs Unsupervised Learning',
        type: 'interview',
        category: 'AI/ML Engineer',
        difficulty: 'easy',
        content: 'Compare Supervised and Unsupervised Learning. Give one business example of each.',
        hints: ['Supervised uses labeled datasets (e.g. price prediction). Unsupervised finds hidden patterns (e.g. customer segmentation).']
      },
      {
        title: 'Overfitting and Regularization',
        type: 'interview',
        category: 'AI/ML Engineer',
        difficulty: 'medium',
        content: 'Explain what overfitting is. How do L1 (Lasso) and L2 (Ridge) regularization help prevent it?',
        hints: ['Overfitting fits noise instead of signal. L1 adds absolute weight penalty. L2 adds squared weight penalty.']
      },
      {
        title: 'Activation Functions in NN',
        type: 'interview',
        category: 'AI/ML Engineer',
        difficulty: 'hard',
        content: 'Why do we require non-linear activation functions (like ReLU) in neural networks instead of linear ones?',
        hints: ['Without non-linearity, a neural network, no matter how many layers it has, collapses into a simple linear regression.']
      },
      {
        title: 'Gradient Descent Optimization',
        type: 'interview',
        category: 'AI/ML Engineer',
        difficulty: 'hard',
        content: 'Explain the concept of gradient descent. What is the difference between batch, stochastic (SGD), and mini-batch gradient descent?',
        hints: ['Optimization algorithm to minimize loss. Batch uses all data, SGD uses 1 sample, mini-batch uses a small subset per step.']
      },

      // 6. DevOps Engineer (4 questions)
      {
        title: 'CI/CD Pipeline Stages',
        type: 'interview',
        category: 'DevOps Engineer',
        difficulty: 'medium',
        content: 'What are the main stages of a modern CI/CD pipeline, and what actions are performed in each?',
        hints: ['Source control commit, Unit/Linter tests build, Integration tests, Deployment staging, and Release monitoring.']
      },
      {
        title: 'Infrastructure as Code benefits',
        type: 'interview',
        category: 'DevOps Engineer',
        difficulty: 'easy',
        content: 'What is Infrastructure as Code (IaC) and what are its primary benefits?',
        hints: ['Version-controlled architecture, repeatable environments, speed of provisioning, and documentation as code.']
      },
      {
        title: 'Docker Containers vs Virtual Machines',
        type: 'interview',
        category: 'DevOps Engineer',
        difficulty: 'medium',
        content: 'Describe the architectural difference between Docker containers and Virtual Machines.',
        hints: ['Docker shares the host OS kernel and is lightweight. VMs include a full guest OS and run via a hypervisor.']
      },
      {
        title: 'Kubernetes Orchestration Components',
        type: 'interview',
        category: 'DevOps Engineer',
        difficulty: 'hard',
        content: 'Explain the core components of Kubernetes. What are Pods, Services, and Deployments?',
        hints: ['Pods are the smallest execution units. Services expose pods to networking. Deployments manage state and scaling.']
      },

      // 7. Data Scientist (4 questions)
      {
        title: 'Feature Selection Methods',
        type: 'interview',
        category: 'Data Scientist',
        difficulty: 'medium',
        content: 'What feature selection techniques do you use to filter irrelevant features from a machine learning model?',
        hints: ['Filter methods (correlation), Wrapper methods (forward/backward selection), and Embedded methods (Lasso/Decision Trees).']
      },
      {
        title: 'Precision vs Recall trade-off',
        type: 'interview',
        category: 'Data Scientist',
        difficulty: 'medium',
        content: 'What is the difference between Precision and Recall? When would you prioritize Recall over Precision?',
        hints: ['Precision focuses on accuracy of positives. Recall focuses on capturing all positives (e.g. disease diagnosis).']
      },
      {
        title: 'Random Forest vs Gradient Boosting',
        type: 'interview',
        category: 'Data Scientist',
        difficulty: 'hard',
        content: 'Compare Random Forest and Gradient Boosting algorithms in terms of bagging vs boosting.',
        hints: ['Random Forest builds parallel independent trees (bagging). Gradient Boosting builds trees sequentially to fix errors (boosting).']
      },
      {
        title: 'Optimal Clustering Selection',
        type: 'interview',
        category: 'Data Scientist',
        difficulty: 'hard',
        content: 'Explain how K-Means clustering works. How do you find the optimal number of clusters using the Elbow Method?',
        hints: ['Initialize centroids, assign points, update centroids. Plot Within-Cluster Sum of Squares (WCSS) and locate the inflection point.']
      },

      // 8. Behavioral (4 questions)
      {
        title: 'Conflict Resolution Behavioral',
        type: 'interview',
        category: 'Behavioral',
        difficulty: 'medium',
        content: 'Describe a situation where you had a disagreement with a team member. How did you resolve it?',
        hints: ['Use the STAR model. Focus on collaboration, active listening, and achieving a professional compromise.']
      },
      {
        title: 'Overcoming Setbacks',
        type: 'interview',
        category: 'Behavioral',
        difficulty: 'medium',
        content: 'Tell me about a time you made a major mistake or failed in a project. How did you handle the aftermath?',
        hints: ['Own the error immediately, focus on swift resolution, and explain what preventive safeguards you learned to implement.']
      },
      {
        title: 'Prioritization Under Pressure',
        type: 'interview',
        category: 'Behavioral',
        difficulty: 'easy',
        content: 'How do you prioritize your tasks when facing multiple tight deadlines on different projects?',
        hints: ['Explain using frameworks like the Eisenhower Matrix, communicating expectations with stakeholders early, and tracking progress.']
      },
      {
        title: 'Working in a Cross-functional Team',
        type: 'interview',
        category: 'Behavioral',
        difficulty: 'medium',
        content: 'Describe your experience working with a team member who had a non-technical background. How did you bridge the gap?',
        hints: ['Avoid deep jargon, use high-level functional analogies, and encourage feedback loops to ensure mutual understanding.']
      }
    ];

    // Coding Challenges: Array (12 Questions)
    const arrayChallenges = [
      {
        title: 'Find Maximum Element in Array',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'easy',
        content: 'Write a function `findMax(nums)` that takes an array of numbers and returns the largest element. \nExample: `findMax([3, 1, 9, 2])` should return `9`.',
        testCases: [{ input: '[3, 1, 9, 2]', expectedOutput: '9' }, { input: '[-5, -1, -10]', expectedOutput: '-1' }],
        hints: ['Initialize max with the first element and iterate through the array.']
      },
      {
        title: 'Check if Array is Sorted',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'easy',
        content: 'Write a function `isSorted(nums)` that returns `true` if the array is sorted in ascending order, and `false` otherwise.',
        testCases: [{ input: '[1, 2, 3, 4]', expectedOutput: 'true' }, { input: '[1, 3, 2, 4]', expectedOutput: 'false' }],
        hints: ['Compare each element with the next element to verify `nums[i] <= nums[i+1]`.']
      },
      {
        title: 'Remove Duplicates from Sorted Array',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'easy',
        content: 'Write a function `removeDuplicates(nums)` that removes duplicates in-place and returns the number of unique elements.',
        testCases: [{ input: '[1, 1, 2]', expectedOutput: '2' }, { input: '[0, 0, 1, 1, 2, 2]', expectedOutput: '3' }],
        hints: ['Use a two-pointer approach to overwrite duplicates.']
      },
      {
        title: 'Linear Search in Array',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'easy',
        content: 'Write a function `linearSearch(nums, target)` that returns the index of `target` in array `nums`, or `-1` if not found.',
        testCases: [{ input: '[4, 5, 6, 7], 6', expectedOutput: '2' }, { input: '[10, 20], 30', expectedOutput: '-1' }],
        hints: ['Iterate through the array and return index when elements match.']
      },
      {
        title: 'Two Sum Problem',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'medium',
        content: 'Write a function `twoSum(nums, target)` that returns indices of the two numbers that add up to `target`. \nExample: `twoSum([2, 7, 11, 15], 9)` should return `[0, 1]`.',
        testCases: [{ input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' }, { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' }],
        hints: ['Use a map to store values and indices to lookup elements in O(1) time.']
      },
      {
        title: 'Rotate Array by K Steps',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'medium',
        content: 'Write a function `rotateArray(nums, k)` that rotates an array of size `N` to the right by `k` steps. \nExample: `rotateArray([1, 2, 3, 4, 5], 2)` returns `[4, 5, 1, 2, 3]`.',
        testCases: [{ input: '[1, 2, 3, 4, 5], 2', expectedOutput: '[4, 5, 1, 2, 3]' }, { input: '[1, 2], 3', expectedOutput: '[2, 1]' }],
        hints: ['Reverse the entire array, then reverse the first k elements, and reverse the rest.']
      },
      {
        title: 'Subarray Sum Equals K',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'medium',
        content: 'Write a function `subarraySum(nums, k)` that returns the total number of continuous subarrays whose sum equals `k`.',
        testCases: [{ input: '[1, 1, 1], 2', expectedOutput: '2' }, { input: '[1, 2, 3], 3', expectedOutput: '2' }],
        hints: ['Use a cumulative sum hash map to count matches in a single traversal.']
      },
      {
        title: 'Find the Duplicate Number',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'medium',
        content: 'Given an array of size `n + 1` containing integers in range `[1, n]`, return the single duplicate number.',
        testCases: [{ input: '[1, 3, 4, 2, 2]', expectedOutput: '2' }, { input: '[3, 1, 3, 4, 2]', expectedOutput: '3' }],
        hints: ['Use Floyds Tortoise and Hare cycle detection algorithm.']
      },
      {
        title: 'Median of Two Sorted Arrays',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'hard',
        content: 'Write a function `findMedianSortedArrays(nums1, nums2)` that returns the median of two sorted arrays in O(log(m+n)) time.',
        testCases: [{ input: '[1, 3], [2]', expectedOutput: '2.0' }, { input: '[1, 2], [3, 4]', expectedOutput: '2.5' }],
        hints: ['Perform binary search to partition the smaller array such that elements are split evenly.']
      },
      {
        title: 'First Missing Positive',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'hard',
        content: 'Write a function `firstMissingPositive(nums)` that returns the smallest missing positive integer in O(n) time and O(1) space.',
        testCases: [{ input: '[1, 2, 0]', expectedOutput: '3' }, { input: '[3, 4, -1, 1]', expectedOutput: '2' }],
        hints: ['Cycle-sort elements to put them at their matching index: `nums[i]` at `nums[i]-1`.']
      },
      {
        title: 'Merge Overlapping Intervals',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'hard',
        content: 'Write a function `mergeIntervals(intervals)` that merges all overlapping intervals. \nExample: `mergeIntervals([[1,3],[2,6],[8,10]])` returns `[[1,6],[8,10]]`.',
        testCases: [{ input: '[[1, 3], [2, 6], [8, 10]]', expectedOutput: '[[1, 6], [8, 10]]' }],
        hints: ['Sort intervals by their start time first, then merge them sequentially.']
      },
      {
        title: 'Largest Rectangle in Histogram',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'hard',
        content: 'Given an array representing histogram bar heights, find the area of the largest rectangle in the histogram.',
        testCases: [{ input: '[2, 1, 5, 6, 2, 3]', expectedOutput: '10' }],
        hints: ['Use a monotonic stack to find the left and right boundary limits for each bar.']
      }
    ];

    // Coding Challenges: String (12 Questions)
    const stringChallenges = [
      {
        title: 'Reverse a String Challenge',
        type: 'coding',
        category: 'Strings',
        difficulty: 'easy',
        content: 'Write a function `reverseString(str)` that takes a string and returns it in reverse. \nExample: `reverseString("hello")` returns `"olleh"`.',
        testCases: [{ input: '"hello"', expectedOutput: '"olleh"' }, { input: '"world"', expectedOutput: '"dlrow"' }],
        hints: ['You can convert the string to a character array, reverse the array, and join it back.']
      },
      {
        title: 'Valid Palindrome',
        type: 'coding',
        category: 'Strings',
        difficulty: 'easy',
        content: 'Write a function `isPalindrome(s)` that returns `true` if a string is a palindrome after removing non-alphanumeric characters.',
        testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' }, { input: '"race a car"', expectedOutput: 'false' }],
        hints: ['Use two pointers converging towards the middle, ignoring non-alphanumeric characters.']
      },
      {
        title: 'Length of Last Word',
        type: 'coding',
        category: 'Strings',
        difficulty: 'easy',
        content: 'Write a function `lengthOfLastWord(s)` that returns the length of the last word in a string of spaces and words.',
        testCases: [{ input: '"Hello World"', expectedOutput: '5' }, { input: '"   fly me   to   the moon  "', expectedOutput: '4' }],
        hints: ['Trim the string first, then search for the last space character.']
      },
      {
        title: 'Valid Anagram',
        type: 'coding',
        category: 'Strings',
        difficulty: 'easy',
        content: 'Write a function `isAnagram(s, t)` that checks if string `t` is an anagram of string `s`.',
        testCases: [{ input: '"anagram", "nagaram"', expectedOutput: 'true' }, { input: '"rat", "car"', expectedOutput: 'false' }],
        hints: ['Compare sorted versions of both strings or count characters using a hash map.']
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        type: 'coding',
        category: 'Strings',
        difficulty: 'medium',
        content: 'Write a function `lengthOfLongestSubstring(s)` that returns the length of the longest substring without duplicate characters.',
        testCases: [{ input: '"abcabcbb"', expectedOutput: '3' }, { input: '"bbbbb"', expectedOutput: '1' }],
        hints: ['Use a sliding window approach with a set tracking the current characters.']
      },
      {
        title: 'Group Anagrams together',
        type: 'coding',
        category: 'Strings',
        difficulty: 'medium',
        content: 'Write a function `groupAnagrams(strs)` that groups words that are anagrams of each other.',
        testCases: [{ input: '["eat", "tea", "tan", "ate", "nat", "bat"]', expectedOutput: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]' }],
        hints: ['Use a map where the key is the sorted version of the word.']
      },
      {
        title: 'String to Integer (atoi)',
        type: 'coding',
        category: 'Strings',
        difficulty: 'medium',
        content: 'Write a function `myAtoi(s)` that parses digits from a string and converts them to a signed 32-bit integer.',
        testCases: [{ input: '"42"', expectedOutput: '42' }, { input: '"   -42"', expectedOutput: '-42' }],
        hints: ['Discard leading whitespace, check sign, read digits, and handle 32-bit overflow.']
      },
      {
        title: 'Reverse Words in a String',
        type: 'coding',
        category: 'Strings',
        difficulty: 'medium',
        content: 'Write a function `reverseWords(s)` that reverses the order of words in a string, trimming redundant spaces.',
        testCases: [{ input: '"the sky is blue"', expectedOutput: '"blue is sky the"' }, { input: '"  hello world  "', expectedOutput: '"world hello"' }],
        hints: ['Split the string by spaces, filter out empty elements, reverse the list, and join.']
      },
      {
        title: 'Regular Expression Matching',
        type: 'coding',
        category: 'Strings',
        difficulty: 'hard',
        content: 'Write a function `isMatch(s, p)` implementing regular expression matching supporting `.` and `*`.',
        testCases: [{ input: '"aa", "a*"', expectedOutput: 'true' }, { input: '"ab", ".*"', expectedOutput: 'true' }],
        hints: ['Use dynamic programming. Define `dp[i][j]` matching substring `s[0..i]` and pattern `p[0..j]`.']
      },
      {
        title: 'Edit Distance',
        type: 'coding',
        category: 'Strings',
        difficulty: 'hard',
        content: 'Write a function `minDistance(word1, word2)` returning the minimum edit operations (insert, delete, replace) to match.',
        testCases: [{ input: '"horse", "ros"', expectedOutput: '3' }],
        hints: ['Use a classic 2D dynamic programming grid tracking match distances.']
      },
      {
        title: 'Substring with Concatenation of All Words',
        type: 'coding',
        category: 'Strings',
        difficulty: 'hard',
        content: 'Find all starting indices of substrings in `s` that are a concatenation of all words from a list.',
        testCases: [{ input: '"barfoothefoobarman", ["foo", "bar"]', expectedOutput: '[0, 9]' }],
        hints: ['Use a map tracking word counts and scan the string with sliding windows.']
      },
      {
        title: 'Minimum Window Substring',
        type: 'coding',
        category: 'Strings',
        difficulty: 'hard',
        content: 'Given two strings `s` and `t`, return the minimum substring of `s` containing all characters in `t`.',
        testCases: [{ input: '"ADOBECODEBANC", "ABC"', expectedOutput: '"BANC"' }],
        hints: ['Use a sliding window with pointers contracting once all constraints are met.']
      }
    ];

    // Coding Challenges: Linked List (12 Questions)
    const linkedListChallenges = [
      {
        title: 'Reverse a Linked List',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'easy',
        content: 'Write a function `reverseList(head)` that reverses a singly linked list and returns the new head.',
        testCases: [{ input: '[1, 2, 3, 4]', expectedOutput: '[4, 3, 2, 1]' }],
        hints: ['Iterate through the list, changing next references to the previous node.']
      },
      {
        title: 'Detect Cycle in Linked List',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'easy',
        content: 'Write a function `hasCycle(head)` that returns `true` if the linked list has a cycle (loop), and `false` otherwise.',
        testCases: [{ input: '[3, 2, 0, -4] -> cycle', expectedOutput: 'true' }],
        hints: ['Use Floyds cycle-finding method using slow (1-step) and fast (2-step) pointers.']
      },
      {
        title: 'Merge Two Sorted Lists',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'easy',
        content: 'Write a function `mergeTwoLists(list1, list2)` to merge two sorted linked lists into a single sorted list.',
        testCases: [{ input: '[1, 2, 4], [1, 3, 4]', expectedOutput: '[1, 1, 2, 3, 4, 4]' }],
        hints: ['Create a dummy node and attach nodes by comparing element values.']
      },
      {
        title: 'Middle of the Linked List',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'easy',
        content: 'Write a function `middleNode(head)` that returns the middle node of a linked list.',
        testCases: [{ input: '[1, 2, 3, 4, 5]', expectedOutput: '3' }],
        hints: ['Increment slow pointer by 1 step and fast pointer by 2 steps. Slow is at the middle when fast ends.']
      },
      {
        title: 'Remove Nth Node from End',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'medium',
        content: 'Write a function `removeNthFromEnd(head, n)` that removes the nth node from the end of the list.',
        testCases: [{ input: '[1, 2, 3, 4, 5], 2', expectedOutput: '[1, 2, 3, 5]' }],
        hints: ['Use two pointers spaced N nodes apart, then slide them together to locate the target node.']
      },
      {
        title: 'Add Two Numbers Linked List',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'medium',
        content: 'Given two non-empty linked lists representing positive numbers in reverse order, add them and return the sum list.',
        testCases: [{ input: '[2, 4, 3], [5, 6, 4]', expectedOutput: '[7, 0, 8]' }],
        hints: ['Iterate through both lists, add values with a carry tracker, and create new nodes.']
      },
      {
        title: 'Intersection of Two Lists',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'medium',
        content: 'Write a function `getIntersectionNode(headA, headB)` that returns the node where two linked lists intersect.',
        testCases: [{ input: '[4,1,8,4,5], [5,6,1,8,4,5]', expectedOutput: '8' }],
        hints: ['Align both pointers at the same relative offset to identify the converging node.']
      },
      {
        title: 'Sort List (Merge Sort)',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'medium',
        content: 'Write a function `sortList(head)` that sorts a linked list in O(n log n) time using Merge Sort.',
        testCases: [{ input: '[4, 2, 1, 3]', expectedOutput: '[1, 2, 3, 4]' }],
        hints: ['Find middle, divide list, recursively sort halves, and merge them.']
      },
      {
        title: 'Reverse Nodes in k-Group',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'hard',
        content: 'Write a function `reverseKGroup(head, k)` reversing nodes of a linked list `k` at a time.',
        testCases: [{ input: '[1, 2, 3, 4, 5], 2', expectedOutput: '[2, 1, 4, 3, 5]' }],
        hints: ['Count k nodes, reverse them, and recursively stitch the next group.']
      },
      {
        title: 'Merge k Sorted Lists',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'hard',
        content: 'Write a function `mergeKLists(lists)` that merges `k` sorted linked lists into a single sorted list.',
        testCases: [{ input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' }],
        hints: ['Use a min-heap or priority queue to merge nodes efficiently.']
      },
      {
        title: 'Copy List with Random Pointer',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'hard',
        content: 'Deep copy a linked list where each node contains a next pointer and a random pointer.',
        testCases: [{ input: '[[7, null], [13, 0]]', expectedOutput: '[[7, null], [13, 0]]' }],
        hints: ['Insert cloned nodes adjacent to original nodes to easily map random references.']
      },
      {
        title: 'Flatten a Multilevel Linked List',
        type: 'coding',
        category: 'Linked List',
        difficulty: 'hard',
        content: 'Flatten a multilevel doubly linked list so that all nodes appear in a single-level list.',
        testCases: [{ input: '[1, 2, 3, 4, 5, 6, null, null, 7, 8]', expectedOutput: '[1, 2, 3, 7, 8, 4, 5, 6]' }],
        hints: ['Iterate through, and push any child nodes into a stack to parse sequentially.']
      }
    ];

    // Coding Challenges: Stacks and Queues (12 Questions)
    const stackChallenges = [
      {
        title: 'Valid Parentheses Check',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'easy',
        content: 'Write a function `isValid(s)` checking if parentheses in string `s` are properly open and closed.',
        testCases: [{ input: '"()[]{}"', expectedOutput: 'true' }, { input: '"(]"', expectedOutput: 'false' }],
        hints: ['Push opening brackets to a stack, and pop them when matching closing brackets are encountered.']
      },
      {
        title: 'Implement Queue using Stacks',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'easy',
        content: 'Implement a FIFO queue using only two LIFO stacks.',
        testCases: [{ input: 'push(1), push(2), pop()', expectedOutput: '1' }],
        hints: ['Push elements to Stack1. Shift elements to Stack2 on pop operation to reverse order.']
      },
      {
        title: 'Min Stack Implementation',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'easy',
        content: 'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.',
        testCases: [{ input: 'push(-2), push(0), getMin()', expectedOutput: '-2' }],
        hints: ['Maintain an auxiliary stack tracking the minimum element seen so far at each level.']
      },
      {
        title: 'Next Greater Element I',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'easy',
        content: 'Given an array, find the next greater element for each index to its right.',
        testCases: [{ input: '[4, 5, 2, 10]', expectedOutput: '[5, 10, 10, -1]' }],
        hints: ['Use a monotonic stack to resolve next greater elements in a single pass.']
      },
      {
        title: 'Evaluate Reverse Polish Notation',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'medium',
        content: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation (postfix).',
        testCases: [{ input: '["2", "1", "+", "3", "*"]', expectedOutput: '9' }],
        hints: ['Push numbers to a stack and evaluate values when operators (+, -, *, /) are parsed.']
      },
      {
        title: 'Daily Temperatures Stack',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'medium',
        content: 'Given an array of temperatures, return an array of days to wait for a warmer day.',
        testCases: [{ input: '[73, 74, 75, 71, 69, 72]', expectedOutput: '[1, 1, 0, 2, 1, 0]' }],
        hints: ['Use a monotonic stack to store indexes of unresolved cold days.']
      },
      {
        title: 'Simplify Path',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'medium',
        content: 'Given an absolute Unix file path, simplify it to its canonical path.',
        testCases: [{ input: '"/home//foo/"', expectedOutput: '"/home/foo"' }, { input: '"/../"', expectedOutput: '"/"' }],
        hints: ['Split path by slashes, and push directories to stack. Pop on double dot ".." directory names.']
      },
      {
        title: 'Generate Parentheses',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'medium',
        content: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
        testCases: [{ input: '3', expectedOutput: '["((()))", "(()())", "(())()", "()(())", "()()()"]' }],
        hints: ['Use backtracking. Keep track of open and close bracket counts.']
      },
      {
        title: 'Sliding Window Maximum',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'hard',
        content: 'Given an array and sliding window `k`, return the maximum element in each window.',
        testCases: [{ input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[3,3,5,5,6,7]' }],
        hints: ['Use a double-ended queue (deque) storing indices of elements in decreasing value order.']
      },
      {
        title: 'Trapping Rain Water',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'hard',
        content: 'Given `n` non-negative integers representing elevation maps, compute how much water is trapped after raining.',
        testCases: [{ input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' }],
        hints: ['Use a monotonic stack or two-pointer approach tracking boundary heights.']
      },
      {
        title: 'Longest Valid Parentheses',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'hard',
        content: 'Find the length of the longest valid (well-formed) parentheses substring.',
        testCases: [{ input: '"(()"', expectedOutput: '2' }, { input: '")()())"', expectedOutput: '4' }],
        hints: ['Use a stack initialized with index -1 to track segment boundaries.']
      },
      {
        title: 'Design Circular Queue',
        type: 'coding',
        category: 'Stacks and Queues',
        difficulty: 'hard',
        content: 'Design your implementation of the circular queue supporting enqueue, dequeue, front, and rear.',
        testCases: [{ input: 'enqueue(1), enqueue(2), Front()', expectedOutput: '1' }],
        hints: ['Use a fixed-size array with head and tail pointers wrapping around using modulo arithmetic.']
      }
    ];

    // Coding Challenges: Trees and Graphs (12 Questions)
    const treeChallenges = [
      {
        title: 'Inorder Traversal of Binary Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'easy',
        content: 'Write a function `inorder(root)` that returns the inorder traversal values of a binary tree.',
        testCases: [{ input: '[1, null, 2, 3]', expectedOutput: '[1, 3, 2]' }],
        hints: ['Recursively traverse Left subtree, visit Node, then traverse Right subtree.']
      },
      {
        title: 'Maximum Depth of Binary Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'easy',
        content: 'Write a function `maxDepth(root)` returning the height/maximum path depth of a binary tree.',
        testCases: [{ input: '[3, 9, 20, null, null, 15, 7]', expectedOutput: '3' }],
        hints: ['Return 1 + maximum height of left and right child subtrees.']
      },
      {
        title: 'Check Symmetric Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'easy',
        content: 'Write a function `isSymmetric(root)` checking if a tree is a mirror image of itself.',
        testCases: [{ input: '[1, 2, 2, 3, 4, 4, 3]', expectedOutput: 'true' }],
        hints: ['Compare left subtree left element to right subtree right element recursively.']
      },
      {
        title: 'Path Sum in Binary Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'easy',
        content: 'Check if a binary tree has a root-to-leaf path summing up to `targetSum`.',
        testCases: [{ input: '[5,4,8,11,null,13,4], 22', expectedOutput: 'true' }],
        hints: ['Subtract node value from target at each level and check leaves.']
      },
      {
        title: 'Validate Binary Search Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'medium',
        content: 'Validate if a binary tree conforms to Binary Search Tree properties.',
        testCases: [{ input: '[2, 1, 3]', expectedOutput: 'true' }, { input: '[5, 1, 4, null, null, 3, 6]', expectedOutput: 'false' }],
        hints: ['Ensure node values are bounded by strict minimum and maximum ranges.']
      },
      {
        title: 'Binary Tree Level Order Traversal',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'medium',
        content: 'Return the level order traversal (BFS) of its nodes values.',
        testCases: [{ input: '[3, 9, 20, null, null, 15, 7]', expectedOutput: '[[3], [9, 20], [15, 7]]' }],
        hints: ['Use a queue to process nodes level by level.']
      },
      {
        title: 'Number of Islands (BFS/DFS)',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'medium',
        content: 'Given an `m x n` 2D binary grid representing land and water, return the number of islands.',
        testCases: [{ input: '[["1","1","0"],["1","1","0"],["0","0","0"]]', expectedOutput: '1' }],
        hints: ['Traverse grid. On finding land "1", run BFS/DFS to sink adjacent islands.']
      },
      {
        title: 'Clone Graph',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'medium',
        content: 'Return a deep copy of a connected undirected graph.',
        testCases: [{ input: '[[2,4],[1,3],[2,4],[1,3]]', expectedOutput: '[[2,4],[1,3],[2,4],[1,3]]' }],
        hints: ['Use a map to store original-to-clone nodes during DFS traversal.']
      },
      {
        title: 'Binary Tree Maximum Path Sum',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'hard',
        content: 'Find the maximum path sum in a binary tree from any node to any node.',
        testCases: [{ input: '[-10, 9, 20, null, null, 15, 7]', expectedOutput: '42' }],
        hints: ['Track path sums globally while returning the maximum branch path to parent.']
      },
      {
        title: 'Serialize and Deserialize Binary Tree',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'hard',
        content: 'Design an algorithm to serialize a binary tree to string and deserialize it back.',
        testCases: [{ input: '[1, 2, 3]', expectedOutput: '[1, 2, 3]' }],
        hints: ['Perform preorder traversal, writing "#" or "null" to record missing child positions.']
      },
      {
        title: 'Word Ladder',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'hard',
        content: 'Find the length of the shortest transformation sequence from `beginWord` to `endWord`.',
        testCases: [{ input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' }],
        hints: ['Perform bidirectional BFS to identify paths with minimum steps.']
      },
      {
        title: 'Alien Dictionary',
        type: 'coding',
        category: 'Trees and Graphs',
        difficulty: 'hard',
        content: 'Find the order of letters in an alien language given a sorted dictionary list.',
        testCases: [{ input: '["wrt","wrf","er","ett","rftt"]', expectedOutput: '"wertf"' }],
        hints: ['Build a directed graph of character dependencies and run topological sort.']
      }
    ];

    // Coding Challenges: Recursion (12 Questions)
    const recursionChallenges = [
      {
        title: 'Fibonacci Number Recursion',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'easy',
        content: 'Write a recursive function `fib(n)` returning the nth Fibonacci number.',
        testCases: [{ input: '2', expectedOutput: '1' }, { input: '4', expectedOutput: '3' }],
        hints: ['Base cases: return N for N <= 1. Otherwise, return `fib(N-1) + fib(N-2)`.']
      },
      {
        title: 'Power of Three',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'easy',
        content: 'Write a recursive function `isPowerOfThree(n)` checking if an integer is a power of three.',
        testCases: [{ input: '27', expectedOutput: 'true' }, { input: '45', expectedOutput: 'false' }],
        hints: ['Base cases: N <= 0 is false, N = 1 is true. Check `N % 3 === 0` and recurse with `N / 3`.']
      },
      {
        title: 'Factorial Calculation Recursion',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'easy',
        content: 'Write a recursive function `factorial(n)` returning the product of numbers up to N.',
        testCases: [{ input: '5', expectedOutput: '120' }],
        hints: ['Base case: return 1 for N <= 1. Otherwise, return `N * factorial(N-1)`.']
      },
      {
        title: 'Sum of Digits Recursion',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'easy',
        content: 'Write a recursive function `digitSum(n)` calculating the sum of its digits.',
        testCases: [{ input: '1234', expectedOutput: '10' }],
        hints: ['Add `N % 10` to recursive result of `Math.floor(N / 10)`.']
      },
      {
        title: 'Subsets Generation (Power Set)',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'medium',
        content: 'Given an integer array, return all possible subsets (power set) using backtracking.',
        testCases: [{ input: '[1, 2]', expectedOutput: '[[], [1], [2], [1, 2]]' }],
        hints: ['Recurse by exploring options: include the current element, or exclude it.']
      },
      {
        title: 'Permutations of Array',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'medium',
        content: 'Write a function `permute(nums)` returning all possible permutations.',
        testCases: [{ input: '[1, 2]', expectedOutput: '[[1, 2], [2, 1]]' }],
        hints: ['Swap elements recursively at each pointer offset to generate all arrangements.']
      },
      {
        title: 'Tower of Hanoi Solution',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'medium',
        content: 'Find the minimum steps to move `n` disks from Peg A to Peg C using Peg B.',
        testCases: [{ input: '3', expectedOutput: '7' }],
        hints: ['Move N-1 disks from A to B, shift the Nth to C, then shift N-1 disks from B to C.']
      },
      {
        title: 'Word Search Backtracking',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'medium',
        content: 'Check if a word exists in a 2D character board by traversing adjacent blocks recursively.',
        testCases: [{ input: '[["A","B"],["C","D"]], "ABD"', expectedOutput: 'true' }],
        hints: ['Use recursive DFS backtracking to walk paths, masking visited positions temporarily.']
      },
      {
        title: 'N-Queens Solver',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'hard',
        content: 'Solve the N-Queens placement puzzle. Return all distinct board configurations.',
        testCases: [{ input: '4', expectedOutput: '2' }],
        hints: ['Place queens row-by-row, validating conflicts across columns and diagonals.']
      },
      {
        title: 'Sudoku Solver Recursion',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'hard',
        content: 'Write a recursive program to solve a Sudoku puzzle by filling empty cells.',
        testCases: [{ input: 'boardGrid', expectedOutput: 'solvedGrid' }],
        hints: ['For each empty cell, attempt digits 1-9. Recurse, and backtrack if a conflict occurs.']
      },
      {
        title: 'Palindrome Partitioning',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'hard',
        content: 'Partition a string such that every substring is a palindrome. Return all partitions.',
        testCases: [{ input: '"aab"', expectedOutput: '[["a","a","b"],["aa","b"]]' }],
        hints: ['Use backtracking. If the prefix is a palindrome, recurse on the suffix.']
      },
      {
        title: 'Rat in a Maze',
        type: 'coding',
        category: 'Recursion',
        difficulty: 'hard',
        content: 'Find all paths for a rat to travel from cell (0,0) to cell (n-1,n-1) in a grid.',
        testCases: [{ input: '[[1, 0], [1, 1]]', expectedOutput: '["DR"]' }],
        hints: ['Use backtracking. Move in directions (D, L, R, U) and backtrack on walls "0".']
      }
    ];

    // Combine all questions
    const allQuestions = [
      ...aptitudeQuestions,
      ...interviewPrompts,
      ...arrayChallenges,
      ...stringChallenges,
      ...linkedListChallenges,
      ...stackChallenges,
      ...treeChallenges,
      ...recursionChallenges
    ];

    await Question.insertMany(allQuestions);
    console.log(`Seeded practice questions database with ${allQuestions.length} questions.`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
