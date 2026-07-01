async function callGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API Key missing');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: systemInstruction ? `${systemInstruction}\n\nInput:\n${prompt}` : prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`Gemini error status ${response.status}`);
  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(textResponse);
}

async function analyzeResume(resumeText, studentSkills = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const systemInstruction = `You are a technical recruiter. Analyze the resume. Return JSON: { "score": number, "detectedSkills": [string], "missingSkills": [string], "suggestions": [string] }`;
      return await callGemini(`Resume:\n${resumeText}\nSkills:\n${studentSkills.join(', ')}`, systemInstruction);
    } catch (e) {
      console.warn('Gemini error, fallback activated');
    }
  }

  const textToScan = (resumeText + ' ' + studentSkills.join(' ')).toLowerCase();
  const skillMap = { react: 'React.js', node: 'Node.js', express: 'Express.js', mongodb: 'MongoDB', javascript: 'JavaScript', python: 'Python', java: 'Java', html: 'HTML5', css: 'CSS3', tailwind: 'Tailwind CSS', git: 'Git & GitHub', dsa: 'Data Structures & Algorithms' };
  const detected = [], missing = [], suggestions = [];

  Object.entries(skillMap).forEach(([k, v]) => {
    if (textToScan.includes(k)) detected.push(v);
    else missing.push(v);
  });

  let score = 55 + (detected.length * 4);
  if (textToScan.includes('experience') || textToScan.includes('intern')) score += 10;
  if (textToScan.includes('project') || textToScan.includes('github.com')) score += 10;
  score = Math.min(Math.max(score, 30), 98);

  if (detected.length < 5) suggestions.push('Add more technical keywords to pass ATS filters.');
  if (!textToScan.includes('project')) suggestions.push('Include a dedicated Projects section.');
  if (!textToScan.includes('git')) suggestions.push('Add your GitHub link and Git workflow skills.');
  if (suggestions.length === 0) suggestions.push('Resume looks solid. Describe specific metrics in your project tasks.');

  return { score, detectedSkills: detected.slice(0, 8), missingSkills: missing.slice(0, 5), suggestions };
}

async function evaluateInterviewAnswer(question, studentAnswer, category) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const systemInstruction = `You are a Technical Interviewer. Evaluate the answer. Return JSON: { "score": number, "strengths": [string], "weaknesses": [string], "suggestions": [string] }`;
      return await callGemini(`Q: ${question}\nA: ${studentAnswer}\nCat: ${category}`, systemInstruction);
    } catch (e) {
      console.warn('Gemini evaluation failed, activating fallback');
    }
  }

  const answerLength = studentAnswer.trim().split(/\s+/).length;
  const lowercaseAnswer = studentAnswer.toLowerCase();
  let score = 5;
  const strengths = [], weaknesses = [], suggestions = [];

  if (answerLength > 50) {
    score += 2;
    strengths.push('Good articulation and answer depth.');
  } else {
    score -= 1;
    weaknesses.push('Response is too brief.');
    suggestions.push('Elaborate your answers using the STAR format (Situation, Task, Action, Result).');
  }

  if (category === 'Behavioral') {
    const keywords = ['team', 'conflict', 'resolved', 'project', 'communication'];
    const matched = keywords.filter(w => lowercaseAnswer.includes(w));
    if (matched.length >= 2) {
      score += 2;
      strengths.push('Demonstrates solid soft skills and team awareness.');
    } else {
      weaknesses.push('Lacks team collaboration context.');
    }
  } else {
    const techWords = ['react', 'node', 'database', 'complexity', 'optimize', 'state', 'api'];
    const matched = techWords.filter(w => lowercaseAnswer.includes(w));
    if (matched.length >= 2) {
      score += 2;
      strengths.push('Utilizes correct technical vocabulary.');
    } else {
      weaknesses.push('Could be more specific about technical architecture.');
      suggestions.push('Explain space/time complexities and design details in technical prompts.');
    }
  }

  return { score: Math.min(Math.max(score, 2), 10), strengths, weaknesses, suggestions };
}

async function recommendCompanies(studentProfile, activeDrives = []) {
  const matches = [];
  const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase());
  const studentCgpa = studentProfile.cgpa || 0;

  activeDrives.forEach(drive => {
    let score = 50;
    const reasons = [];

    if (studentCgpa >= drive.criteria.minCgpa) {
      score += 15;
      reasons.push(`Your CGPA (${studentCgpa}) exceeds the eligibility threshold of ${drive.criteria.minCgpa}.`);
    } else {
      score -= 20;
      reasons.push(`Your CGPA (${studentCgpa}) is below the required cutoff.`);
    }

    const driveSkills = drive.criteria.requiredSkills || [];
    let skillMatches = 0;
    driveSkills.forEach(ds => {
      if (studentSkills.includes(ds.toLowerCase())) skillMatches++;
    });

    if (driveSkills.length > 0) {
      const ratio = skillMatches / driveSkills.length;
      score += Math.round(ratio * 30);
      if (skillMatches > 0) {
        reasons.push(`Matched ${skillMatches} out of ${driveSkills.length} key skills (${driveSkills.join(', ')}).`);
      } else {
        reasons.push('Develop skill sets matching their required stack.');
      }
    } else {
      score += 15;
    }

    matches.push({
      companyName: drive.companyName,
      jobRole: drive.jobRole,
      matchPercentage: Math.min(Math.max(score, 10), 98),
      matchReason: reasons.join(' ')
    });
  });

  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

module.exports = { analyzeResume, evaluateInterviewAnswer, recommendCompanies };
