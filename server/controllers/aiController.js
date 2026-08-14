const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Mock data to fallback to if Gemini API fails or the API Key is invalid
const MOCK_DIAGNOSES = [
  {
    plantName: "Money Plant (Epipremnum aureum)",
    disease: "Healthy",
    suggestions: [
      "Keep doing what you are doing! The foliage looks vibrant and healthy.",
      "Ensure it receives bright, indirect sunlight to maintain its variegation.",
      "Water only when the top 2 inches of soil feel dry to the touch.",
      "Wipe the leaves occasionally with a damp cloth to remove dust and improve photosynthesis."
    ],
    confidenceScore: 0.95
  },
  {
    plantName: "Snake Plant (Sansevieria trifasciata)",
    disease: "Root Rot (Overwatering)",
    suggestions: [
      "Immediately reduce watering frequency. Snake plants prefer drying out completely.",
      "Repot the plant in well-draining soil mixed with perlite or coarse sand.",
      "Cut away any mushy, brown roots using sterilized pruning shears before repotting.",
      "Ensure the pot has adequate drainage holes at the bottom."
    ],
    confidenceScore: 0.88
  },
  {
    plantName: "Monstera Deliciosa",
    disease: "Leaf Spot Disease (Fungal)",
    suggestions: [
      "Isolate the plant from other house plants to prevent the fungus from spreading.",
      "Prune the heavily infected leaves showing large brown spots with yellow halos.",
      "Avoid overhead watering; water the soil directly to keep the leaves dry.",
      "Apply an organic copper-based fungicide according to package directions."
    ],
    confidenceScore: 0.91
  }
];

const getMockDiagnosis = (fileName) => {
  const name = (fileName || "").toLowerCase();
  if (name.includes("snake") || name.includes("sansevieria")) {
    return MOCK_DIAGNOSES[1];
  } else if (name.includes("monstera") || name.includes("swiss")) {
    return MOCK_DIAGNOSES[2];
  }
  // Default to random or Money Plant
  return MOCK_DIAGNOSES[Math.floor(Math.random() * MOCK_DIAGNOSES.length)];
};

const analyzePlant = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key is present and doesn't look like a default placeholder
    if (!apiKey || apiKey.startsWith('your_') || apiKey === 'None') {
      throw new Error("Missing or invalid GEMINI_API_KEY in environment configuration.");
    }

    console.log("--- Initializing Gemini AI Scan ---");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are a professional botanist and plant pathologist. Your task is to analyze the uploaded image to identify the plant and diagnose its health status. Be highly accurate, objective, and deterministic. Do not guess, do not force a plant identification, and do not invent diseases. If the image does not contain a plant or plant leaf, or is too unclear/low-quality to determine, indicate this strictly according to the requested JSON response format.",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0
      }
    });

    const imageData = fs.readFileSync(req.file.path).toString('base64');
    
    const prompt = `Analyze this image and return a JSON object with the following fields:
{
  "plantDetected": boolean,
  "plantName": string | null,
  "scientificName": string | null,
  "healthStatus": "Healthy" | "Sick" | "Unclear" | null,
  "confidence": number (0 to 100),
  "problem": string | null,
  "recommendations": string[],
  "reason": string | null
}

Guidelines:
1. If the image does not contain a plant or plant leaf:
   - Set "plantDetected" to false.
   - Set "plantName", "scientificName", "healthStatus", "problem" to null.
   - Set "confidence" to 0.
   - Set "recommendations" to [].
   - Set "reason" to a description of what was detected instead, asking the user to upload a clear plant photo.
2. If the image is unclear, blurry, or of low quality, and you cannot confidently determine the plant or its visible condition:
   - Set "plantDetected" to true or false depending on if a plant is visually visible.
   - Set "plantName" to "Unclear".
   - Set "scientificName" to null.
   - Set "healthStatus" to "Unclear".
   - Set "problem" to null.
   - Set "confidence" to a low number (e.g. 0 to 10).
   - Set "recommendations" to [].
   - Set "reason" to an explanation of why you cannot identify it, asking the user to upload a clearer, well-lit image.
3. If a plant/leaf is successfully detected and can be identified:
   - Set "plantDetected" to true.
   - Identify the common "plantName" and the "scientificName".
   - Set "healthStatus" to "Healthy" or "Sick".
   - If "healthStatus" is "Sick", identify the specific disease/pest/watering issue in "problem", and provide actionable organic or professional remedies in "recommendations".
   - If "healthStatus" is "Healthy", set "problem" to null, and provide general plant care guidelines in "recommendations".
   - Set "confidence" as an integer percentage from 0 to 100 reflecting your certainty.
   - Set "reason" to null.`;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: req.file.mimetype
        }
      }
    ]);

    const responseText = result.response.text();
    console.log("Gemini API Raw Response:", responseText);

    const analysis = JSON.parse(responseText);

    // Validate that the returned object contains the required fields
    if (
      typeof analysis.plantDetected !== 'boolean' ||
      (analysis.plantDetected && !analysis.plantName) ||
      !Array.isArray(analysis.recommendations)
    ) {
      throw new Error("Invalid response schema from Gemini API.");
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(200).json(analysis);

  } catch (error) {
    console.error('--------------------------------------------------');
    console.error('AI SCANNER EXCEPTION:', error.message);
    console.error('A authentication, rate-limit, or configuration issue occurred with the Gemini API.');
    console.error('Please verify that GEMINI_API_KEY in server/.env is valid and active.');
    console.error('Google AI Studio: https://aistudio.google.com/');
    console.error('--------------------------------------------------');

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: error.message || 'Error communicating with AI Doctor' });
  }
};

module.exports = { analyzePlant };
