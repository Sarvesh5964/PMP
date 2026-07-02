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
      }
    ];

    // Seed Interview Prompts
    const interviewPrompts = [
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
