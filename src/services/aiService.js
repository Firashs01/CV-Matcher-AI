const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

/**
 * Helper for exponential backoff retries
 */
const fetchWithRetry = async (payload, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(payload, retries - 1, backoff * 2);
    }
    throw error;
  }
};

/**
 * Extracts keywords and calculates match percentage
 */
export const analyzeCV = async (cvText, jobDescription) => {
  const systemPrompt = `
    You are an ATS (Applicant Tracking System) Expert. 
    Analyze the provided CV text against the Job Description.
    Return a valid JSON object with:
    - match_score: (0-100)
    - matched_keywords: string[]
    - missing_keywords: string[]
    - analysis_summary: string
  `;

  const userQuery = `
    CV Text: ${cvText}
    ---
    Job Description: ${jobDescription}
  `;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const result = await fetchWithRetry(payload);
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) throw new Error("No response from AI");
  return JSON.parse(textResponse);
};

/**
 * Reformulates CV content using the STAR method
 */
export const reformulateCV = async (cvText, jobDescription) => {
  const systemPrompt = `
    You are a Senior Career Coach. 
    Rewrite the user's CV to better match the Job Description.
    Rules:
    - Use the STAR (Situation, Task, Action, Result) method.
    - Highlight missing keywords naturally.
    - Maintain 100% factual accuracy.
    - Output format: Professional Markdown.
  `;

  const userQuery = `
    Original CV: ${cvText}
    ---
    Target Job: ${jobDescription}
  `;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  const result = await fetchWithRetry(payload);
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) throw new Error("No response from AI");
  return textResponse;
};