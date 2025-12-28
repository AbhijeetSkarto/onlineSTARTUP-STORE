
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Initialize AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIText = async (prompt: string, complex = false) => {
  const ai = getAI();
  const model = complex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: complex ? { thinkingConfig: { thinkingBudget: 32768 } } : {}
  });
  
  return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const searchGrounding = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: chunks.map((c: any) => c.web).filter(Boolean)
  };
};

export const mapsGrounding = async (query: string, location?: { lat: number, lng: number }) => {
  const ai = getAI();
  const config: any = {
    tools: [{ googleMaps: {} }, { googleSearch: {} }]
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    places: chunks.map((c: any) => c.maps).filter(Boolean)
  };
};

export const transcribeAudio = async (base64Data: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'audio/mp3' } },
        { text: "Please transcribe this audio exactly." }
      ]
    }
  });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
