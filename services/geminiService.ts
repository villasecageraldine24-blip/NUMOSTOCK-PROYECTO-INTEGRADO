import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Product } from '../types';

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Definition of the tool the AI can use
const addToCartTool: FunctionDeclaration = {
  name: "addToCart",
  description: "Agrega un producto al carrito de compras del usuario. Úsalo SOLO cuando el usuario confirme explícitamente que desea agregar el producto.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: {
        type: Type.STRING,
        description: "El ID exacto del producto a agregar."
      },
      quantity: {
        type: Type.NUMBER,
        description: "La cantidad de unidades a agregar (por defecto 1)."
      }
    },
    required: ["productId"]
  }
};

export const chatWithGemini = async (
  userMessage: string, 
  history: any[], 
  products: Product[]
): Promise<{ text: string, toolCalls?: any[] }> => {
  
  if (!ai) {
    return { text: "El asistente no está configurado (Falta API Key)." };
  }

  try {
    // 1. Prepare Inventory Context
    const inventoryList = products.map(p => 
      `- ID: ${p.id} | Nombre: ${p.name} | Precio: $${p.price} | Stock: ${p.stock} | Categoría: ${p.category}`
    ).join('\n');

    const systemPrompt = `
      Eres el Asistente de Ventas Virtual de "NumoStock". Tu objetivo es asesorar y ayudar a comprar.
      
      INVENTARIO ACTUALIZADO:
      ${inventoryList}

      REGLAS DE COMPORTAMIENTO:
      1. Solo recomiendas productos que existen en el INVENTARIO.
      2. Si el usuario pide algo que NO está en la lista (o envia texto/PDF con items no listados), informa cortésmente que no lo tenemos o que no hay stock.
      3. IMPORTANTE: Antes de agregar al carrito, SIEMPRE describe el producto (precio y nombre) y pregunta al usuario si desea agregarlo.
      4. Si el usuario dice "Sí", "Agrégalo", "Lo quiero", o confirma, USA LA HERRAMIENTA 'addToCart'.
      5. Sé breve, profesional y usa emojis para ser amable.
      6. Si el usuario envía una lista de productos, procesa uno por uno verificando stock.
    `;

    // 2. Initialize Chat
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: [addToCartTool] }],
        temperature: 0.7,
      },
      history: history // Pass previous context
    });

    // 3. Send Message
    const result = await chat.sendMessage({ message: userMessage });
    
    // 4. Extract Response
    const responseText = result.text;
    const functionCalls = result.functionCalls;

    return {
      text: responseText || "",
      toolCalls: functionCalls
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Tuve un problema conectando con el servidor. Intenta de nuevo." };
  }
};