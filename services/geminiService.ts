import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  /**
   * AI Writer: Generates a full journalistic post from a specific topic or prompt.
   * Includes Nano Banana image prompting and simulates deep investigative research.
   */
  async generatePostFromTopic(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the lead investigative journalist for "The Nation's Eyes". 
      Your task is to write a high-impact, professional newspaper article based on the following topic or prompt.
      
      Requirements:
      1. Tone: Authoritative, insightful, and slightly sophisticated (similar to Noel Chiagorom).
      2. Content: 300-500 words. Use investigative data and simulate Google Search grounding to ensure factual-sounding depth.
      3. Nano Banana Image Prompt: Create a highly detailed text-to-image prompt for the "Nano Banana" engine. It should describe a photorealistic, professional editorial image (4K resolution, cinematic lighting) that perfectly illustrates the article.
      
      Topic/Prompt: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING, description: 'Max 30 words' },
            content: { type: Type.STRING },
            category: { type: Type.STRING, description: 'One of: Politics, Economy, Society, Editorial, World' },
            readTime: { type: Type.STRING, description: 'e.g. "5 min"' },
            imagePrompt: { type: Type.STRING, description: 'Detailed prompt for Nano Banana image generation' }
          },
          required: ["title", "excerpt", "content", "category", "readTime", "imagePrompt"]
        }
      }
    });

    try {
      const result = JSON.parse(response.text.trim());
      return {
        ...result,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'draft', // New posts start as drafts for admin review
        author: 'AI Writer'
      };
    } catch (e) {
      console.error("Failed to parse AI Writer response", e);
      return null;
    }
  },

  /**
   * AI Importer: Processes raw text (e.g. from Facebook) into an article.
   */
  async analyzeArticle(rawText: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract a journalistic blog post from this source content. Provide a catchy headline, a short excerpt (max 30 words), and the cleaned-up editorial content. Ensure the tone is professional and insightful like Noel Chiagorom.
      
      Source: ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING, description: 'One of: Politics, Economy, Society, Editorial, World' },
            readTime: { type: Type.STRING, description: 'e.g. "4 min"' }
          },
          required: ["title", "excerpt", "content", "category", "readTime"]
        }
      }
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse AI Importer response", e);
      return null;
    }
  }
};
