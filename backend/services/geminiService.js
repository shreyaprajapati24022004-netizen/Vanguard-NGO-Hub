const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiMatch = async (need, volunteers) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const volunteersInfo = volunteers.map((v) => ({
      name: v.name,
      skills: v.skills,
      location: v.location,
    }));

    const prompt = `
      You are a smart volunteer matching system for NGOs.
      
      Community Need:
      - Area: ${need.area}
      - Category: ${need.category}
      - Urgency Score: ${need.urgencyScore}
      - Total Reports: ${need.totalReports}
      
      Available Volunteers:
      ${JSON.stringify(volunteersInfo, null, 2)}
      
      Task: Match the top 3 most suitable volunteers for this need.
      
      Respond ONLY in this JSON format, nothing else:
      {
        "matches": [
          {
            "volunteerName": "name here",
            "score": 85,
            "reason": "short reason why this volunteer is a good match"
          }
        ],
        "summary": "brief summary of the matching decision"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

  
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    
    return {
      matches: volunteers.slice(0, 3).map((v) => ({
        volunteerName: v.name,
        score: 50,
        reason: "Manual fallback match",
      })),
      summary: "AI matching failed, manual fallback used",
    };
  }
};

module.exports = { getGeminiMatch };