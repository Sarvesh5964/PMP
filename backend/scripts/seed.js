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
      }
    ];

    await PlacementDrive.insertMany(drives);
    console.log('Seeded placement drives.');

    // Seed Questions
    const questions = [
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
        title: 'Reverse a String',
        type: 'coding',
        category: 'Strings',
        difficulty: 'easy',
        content: 'Write a function `reverseString(str)` that accepts a string and returns it reversed. Example: `reverseString("hello")` should return `"olleh"`.',
        testCases: [
          { input: '"hello"', expectedOutput: '"olleh"' },
          { input: '"placement"', expectedOutput: '"tnemecalp"' }
        ],
        hints: ['You can convert the string to an array, reverse it, and join it back.']
      },
      {
        title: 'Two Sum',
        type: 'coding',
        category: 'Arrays',
        difficulty: 'medium',
        content: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution.\nExample: `twoSum([2, 7, 11, 15], 9)` should return `[0, 1]`.',
        testCases: [
          { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
          { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' }
        ],
        hints: ['Use a hash map to keep track of elements you have already seen and their indices.']
      },
      {
        title: 'State vs Props in React',
        type: 'interview',
        category: 'Frontend Developer',
        difficulty: 'medium',
        content: 'Explain the difference between state and props in React.js, and how data flows.',
        hints: ['State represents internal mutable component data. Props represent external read-only configuration passed from parent.']
      },
      {
        title: 'REST API Design Principles',
        type: 'interview',
        category: 'Backend Engineer',
        difficulty: 'medium',
        content: 'What are the main constraints and principles of RESTful APIs?',
        hints: ['Statelessness, Client-Server architecture, Uniform Interface, Layered System.']
      },
      {
        title: 'Conflict Resolution Behavioral',
        type: 'interview',
        category: 'Behavioral',
        difficulty: 'medium',
        content: 'Describe a situation where you had a disagreement with a team member. How did you resolve it?',
        hints: ['Use the STAR model. Focus on collaboration, active listening, and achieving a professional compromise.']
      }
    ];

    await Question.insertMany(questions);
    console.log('Seeded practice questions database.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
