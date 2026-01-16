
import { GoogleGenAI, Type } from "@google/genai";

// Genişletilmiş trip havuzu (API hata verdiğinde bile oyun sürsün diye)
const TRIP_POOL = [
  "Şu an konuşasım yok gerçekten.",
  "Peki, öyle olsun bakalım.",
  "Her zamanki halin, şaşırmadım.",
  "Yazmasan da olurdu sanki.",
  "Anladım, işin benden daha önemli tabii.",
  "Tamam, sen haklısın (değilsin).",
  "Hıhı, kesin öyledir.",
  "Neyse, ben kaçtım.",
  "Görüldü mü atsam acaba?",
  "Sana söyleyecek söz bulamıyorum artık.",
  "İyi, güzel, harika. Başka?",
  "Bana masal anlatma artık.",
  "Gerçekten inanmamı mı bekliyorsun?",
  "Tamam.",
  "Peki.",
  "Öyle mi?",
  "Vay be, demek böyle olduk..."
];

export const getPartnerResponse = async (
  message: string,
  irritationLevel: number,
  gender: string,
  partnerName: string
) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Kullanıcı: ${message}\nPartner Durumu: ${gender}, Sinir: ${irritationLevel}/100` }] }],
      config: {
        systemInstruction: `Sen huysuz ve trip atan bir partnersin. Kısa, öz ve can sıkıcı cevaplar ver. 
        Asla yapıcı olma. Sürekli eski konuları açıyormuş gibi davran. 
        Yanıtını mutlaka şu JSON formatında gönder: {"reply": "mesajın", "irritationIncrement": sayı}. 
        Sinir seviyesi arttıkça (0-100) daha kaba ol ve 'irritationIncrement' değerini artır.`,
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "";
    
    // Markdown ve gereksiz karakterleri temizle
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn("JSON parse failed, using raw text strategy");
      return {
        reply: text.length > 100 ? text.substring(0, 100) : text,
        irritationIncrement: 5
      };
    }
    
  } catch (error: any) {
    console.error("Gemini Service Error:", error);

    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    // API hatasında rastgele ama anlamlı bir trip seç
    const randomReply = TRIP_POOL[Math.floor(Math.random() * TRIP_POOL.length)];

    return {
      reply: randomReply,
      irritationIncrement: 3
    };
  }
};
