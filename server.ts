import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) 
  });
});

// Maps Grounding Endpoint
app.post("/api/maps/location-reference", async (req, res) => {
  try {
    const { 
      query, 
      latitude = 13.0623, // Default: Sahakarnagar, Bangalore
      longitude = 77.5847, 
      category = "general" 
    } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query string is required." });
    }

    const ai = getGeminiClient();

    // Default to Sahakarnagar context if not specified
    const enrichedPrompt = `You are the local geographical and clinical location intelligence assistant for Sahakar Physio & Elder Care, located in Sahakarnagar, North Bangalore (Pin: 560092).
Provide an accurate, practical location reference and up-to-date neighborhood intelligence for the following inquiry:
"${query}"

Context & Guidelines:
- Primary clinic hub: Sahakarnagar Main Road / 600 sq ft facility, near Kodigehalli Gate, Hebbal, Judicial Layout, and Vidyaranyapura corridor.
- Service radius: 0-8 km for elder home-care visits.
- Include precise landmarks, nearby hospitals, ortho surgeons, diagnostic labs, pharmacies, road connectivity (Airport Road / Bellary Road, Outer Ring Road, Sahakarnagar 60ft road), accessibility, and parking or patient transfer notes where relevant.
- Be concise, structured, and factual.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enrichedPrompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const searchEntryPoint = groundingMetadata?.searchEntryPoint?.renderedContent || null;

    // Filter and normalize map items from grounding chunks
    const mapsLinks: Array<{ title: string; uri: string; address?: string; snippet?: string }> = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps) {
        mapsLinks.push({
          title: chunk.maps.title || "Google Maps Location",
          uri: chunk.maps.uri || "",
          address: chunk.maps.placeAnswerSources?.[0]?.formattedAddress || undefined,
          snippet: chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] || undefined,
        });
      }
    });

    return res.json({
      text: response.text || "No location description returned.",
      mapsLinks,
      groundingChunks,
      searchEntryPoint,
      coordinates: { latitude, longitude },
      category,
    });
  } catch (error: any) {
    console.error("Error in /api/maps/location-reference:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to fetch Maps Grounding location reference." 
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sahakar Physio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
