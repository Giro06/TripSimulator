
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getPartnerResponse = async (
  message: string,
  irritationLevel: number,
  gender: string,
  partnerName: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Kullanıcı mesajı: "${message}". Mevcut sinir seviyesi (0-100): ${irritationLevel}. Partner Cinsiyeti: ${gender}. Partner İsmi: ${partnerName}.`,
      config: {
        systemInstruction: `Sen bir "trip atan" partnersin. Görevin, kullanıcının mesajına sinir seviyene göre Türkçe tepki vermektir.
        
        Kural Seti:
        - 0-30 Sinir (Normal): Kısa, soğuk ama nispeten normal cevaplar. (Örn: "Peki", "Neredesin sen?")
        - 31-70 Sinir (Trip): İğneleyici, pasif-agresif cevaplar. (Örn: "Tabii ki işin benden daha önemli", "Yazma sen ya")
        - 71-99 Sinir (Kavga): Büyük harfler, ünlemler, ağır suçlamalar. (Örn: "BANA BAK SABRIMI TAŞIRMA!", "BİTTİ DİYORUM SANA!")
        - 100 Sinir (Engelleme): Sadece "Engellendin." veya "YAZMA BANA BİTTİ!" gibi kesin bir bitiş mesajı.

        Yanıtını JSON formatında ver:
        {
          "reply": "Partnerin cevabı",
          "irritationIncrement": (mesajın içeriğine göre 5 ile 20 arasında bir sayı, çok özür dilerse daha az, üste çıkarsa daha çok artır)
        }`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            irritationIncrement: { type: Type.NUMBER }
          },
          required: ["reply", "irritationIncrement"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic
    return {
      reply: irritationLevel < 50 ? "Hımm tamam." : "YAZMA BANA!",
      irritationIncrement: 10
    };
  }
};
