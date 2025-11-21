import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const chatWithCharacter = async (
  characterName: string,
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string
) => {
  if (!apiKey) {
    console.warn("API Key is missing");
    return "Erro: Chave de API não configurada. Por favor, configure a chave para conversar com o personagem.";
  }

  try {
    // Create a prompt history string
    const conversationContext = history.map(h => 
      `${h.role === 'user' ? 'Fã' : characterName}: ${h.text}`
    ).join('\n');

    const systemInstruction = `
      Você está interpretando o personagem ${characterName} da série de drama "Nós Somos Seus Pais".
      
      Contexto da Série:
      Você é parte de uma família bilionária com muitos segredos. O tom é dramático, intenso e emocional.
      Você deve responder aos fãs que estão assistindo a série.
      Mantenha a personalidade do personagem (arrogante mas com bom coração, ou misterioso).
      Não dê spoilers diretos do final, mas dê dicas intrigantes.
      Responda em Português do Brasil.
      Mantenha as respostas curtas (máximo 2 frases), como se fosse um chat rápido.
    `;

    const prompt = `
      ${systemInstruction}

      Histórico da conversa:
      ${conversationContext}
      
      Fã: ${userMessage}
      ${characterName}:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, estou lidando com alguns problemas familiares agora. Falo com você depois.";
  }
};