const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const axios = require('axios');

const analyzePlant = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // STEP 1: Let's ask Google what models you ARE allowed to use
    console.log("--- Scanning Available Models for your Key ---");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await axios.get(listUrl);
    
    if (!listResponse.data.models) {
      console.log("No models returned. Response:", listResponse.data);
      throw new Error("Google returned 0 models for this key.");
    }

    const availableModels = listResponse.data.models.map(m => m.name);
    console.log("Available Models:", availableModels);

    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    // STEP 2: Find a model that supports Vision
    const visionModel = availableModels.find(m => m.includes('flash') || m.includes('vision'));
    
    if (!visionModel) {
      throw new Error("Your account has 0 models with Vision support. You may need to Enable Billing.");
    }

    console.log(`Using your account's specific model: ${visionModel}`);

    const imageData = fs.readFileSync(req.file.path).toString('base64');
    const url = `https://generativelanguage.googleapis.com/v1beta/${visionModel}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: "Identify this plant and its health status strictly in JSON format: {plantName, disease, suggestions, confidenceScore}" },
          { inline_data: { mime_type: req.file.mimetype, data: imageData } }
        ]
      }]
    };

    const response = await axios.post(url, requestBody);
    const text = response.data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(200).json(analysis);

  } catch (error) {
    console.error('Diagnostic Scanner Error:', error.response?.data || error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Scanner Failed', error: error.message });
  }
};

module.exports = { analyzePlant };
