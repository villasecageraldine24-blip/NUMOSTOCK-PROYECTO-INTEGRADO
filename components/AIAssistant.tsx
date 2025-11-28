import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';
import { Product } from '../types';

interface AIAssistantProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
}

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ products, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '👋 ¡Hola! Soy el Asistente NumoStock. Puedo ayudarte a buscar productos y agregarlos a tu carro. ¿Qué necesitas hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // History for Gemini SDK (excluding system messages specific to UI)
  const getGeminiHistory = () => {
    return messages
      .filter(m => m.role === 'user' || m.role === 'model')
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Call Gemini Service
    const history = getGeminiHistory();
    const response = await chatWithGemini(userMsg, history, products);

    // Handle Tool Calls (Add to Cart)
    if (response.toolCalls && response.toolCalls.length > 0) {
      let toolExecuted = false;
      
      for (const call of response.toolCalls) {
        if (call.name === 'addToCart') {
          const { productId, quantity } = call.args as { productId: string, quantity: number };
          const product = products.find(p => p.id === productId);
          
          if (product) {
            onAddToCart(product); // Execute logic in App
            // Add System Message for UI Feedback
            setMessages(prev => [...prev, { 
              role: 'system', 
              text: `✅ Agregado al Carro: ${product.name} (1 ud.)` 
            }]);
            toolExecuted = true;
          } else {
             setMessages(prev => [...prev, { 
              role: 'system', 
              text: `❌ Error: No pude encontrar el producto con ID ${productId}` 
            }]);
          }
        }
      }

      // If text accompanies the tool call, show it (e.g., "Great, I added it.")
      if (response.text) {
         setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      } else if (toolExecuted) {
         // If no text but tool executed, generic success
         setMessages(prev => [...prev, { role: 'model', text: "Listo, ya está en tu carrito. ¿Necesitas algo más?" }]);
      }
      
    } else {
      // Normal Text Response
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fade-in" style={{height: '550px'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-sky-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm">Asesor de Compras</h3>
                <p className="text-[10px] text-sky-100 opacity-90">IA con acceso a Inventario</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'system' ? (
                  <div className="w-full flex justify-center my-2">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2 border border-transparent focus-within:border-primary focus-within:bg-white transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ej: Necesito cloro gel..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`p-2 rounded-full text-white transition-all shadow-md ${
                  isLoading || !input.trim() ? 'bg-gray-300' : 'bg-secondary hover:bg-orange-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Gemini AI puede cometer errores. Verifica el stock.
            </p>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-tr from-primary to-blue-900 text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-transform hover:scale-110 group border-2 border-white/20"
        >
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full animate-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
           <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg font-bold">
             ¿Te ayudo a comprar?
           </span>
        </button>
      )}
    </div>
  );
};