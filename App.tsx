
import React, { useState, useEffect } from 'react';
import { Product, CartItem, PaymentMethod } from './types';
import { MOCK_PRODUCTS } from './constants';
import { OdooService } from './services/odooService';
import { EmailService, ContactFormData } from './services/emailService';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  // Application State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        if (product && qty > product.stock) return item;
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const handleCheckout = async (customerData: { name: string; email: string; paymentMethod: PaymentMethod }) => {
    setIsProcessingOrder(true);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
      id: `TEMP-${Date.now()}`,
      customerName: customerData.name,
      customerEmail: customerData.email,
      items: cart,
      total,
      paymentMethod: customerData.paymentMethod,
      date: new Date()
    };

    const response = await OdooService.createSaleOrder(order);

    if (response.success) {
      const updatedProducts = products.map(p => {
        const inCart = cart.find(c => c.id === p.id);
        if (inCart) {
          return { ...p, stock: p.stock - inCart.quantity };
        }
        return p;
      });
      setProducts(updatedProducts);
      await OdooService.checkAndTriggerReplenishment(updatedProducts);
      alert(`¡Compra Exitosa! Orden Odoo: ${response.orderId}\nSe ha enviado el comprobante a ${customerData.email}`);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    } else {
      alert("Error al conectar con Odoo. Intente nuevamente.");
    }
    setIsProcessingOrder(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingContact(true);
    
    try {
      const result = await EmailService.sendContactForm(contactForm);
      if (result.success) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
        // Reset status after 5 seconds
        setTimeout(() => setContactStatus('idle'), 5000);
      }
    } catch (error) {
      setContactStatus('error');
    } finally {
      setIsSendingContact(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  // Mock Categories for display
  const categories = [
    { name: 'Detergentes', image: 'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=300&q=80' },
    { name: 'Desinfección', image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=300&q=80' },
    { name: 'Papeles', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80' },
    { name: 'Implementos', image: 'https://images.unsplash.com/photo-1581578731117-104f2a923227?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dispensadores', image: 'https://images.unsplash.com/photo-1584483766114-2cea6facb57c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Industrial', image: 'https://images.unsplash.com/photo-1528740561666-dc24705f08a7?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20 font-sans">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToContact={() => document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth'})}
      />

      {/* Main Container - Adjusted for fixed header */}
      <div className="pt-24 md:pt-32">
        
        {/* Hero Section */}
        <section className="relative h-[450px] md:h-[550px] w-full bg-primary overflow-hidden">
          <div className="absolute inset-0">
            {/* Fallback enabled image for Hero */}
             <img 
              src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1920&q=80" 
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/1920x600/003366/FFFFFF?text=NumoStock+Limpieza+Industrial';
              }}
              alt="Almacén Limpieza" 
              className="w-full h-full object-cover opacity-40 scale-105 animate-fade-in"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="max-w-3xl animate-fade-in pl-4 border-l-8 border-secondary">
              <span className="text-secondary font-bold tracking-widest uppercase mb-2 block">
                Venta Mayorista y Detalle
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Expertos en <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Insumos de Limpieza</span>
              </h1>
              <p className="text-gray-200 text-xl mb-8 max-w-lg leading-relaxed font-light">
                Abastecemos tu negocio con productos certificados y stock real. Envios rápidos a todo Chile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="bg-secondary text-white px-10 py-4 rounded font-bold uppercase tracking-wide hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-500/50 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                   Ver Catálogo
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                   </svg>
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Carousel / Grid */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-secondary rounded-sm"></span>
                Categorías Destacadas
              </h2>
              <a href="#" className="hidden md:block text-primary font-bold hover:underline">Ver todas</a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.map((cat, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-secondary transition-all duration-300 mb-4 shadow-lg group-hover:shadow-xl relative bg-gray-100">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/200x200/f1f5f9/94a3b8?text=${cat.name.substring(0,3)}`;
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-full pointer-events-none"></div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors text-center">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section id="ofertas" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center relative border border-gray-700">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
               
               <div className="p-10 md:p-16 md:w-3/5 relative z-10">
                 <div className="inline-block bg-secondary text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase">Solo por hoy</div>
                 <h3 className="text-gray-300 font-bold text-xl mb-1 uppercase tracking-wider">Oferta Empresas</h3>
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                   Pack Sanitización <br/>
                   <span className="text-secondary">Industrial</span>
                 </h2>
                 <p className="text-gray-400 mb-8 text-lg max-w-md">Lleva 10 Bidones de Cloro Gel + 5 Desengrasantes con un 20% de descuento adicional.</p>
                 <button 
                    onClick={() => document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                 >
                   Solicitar Cotización
                 </button>
               </div>
               
               <div className="md:w-2/5 h-64 md:h-auto min-h-[300px] bg-gray-800 flex items-center justify-center relative overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80" 
                   className="object-cover w-full h-full opacity-60 mix-blend-overlay hover:opacity-80 transition-opacity duration-700" 
                   alt="Pack Sanitización"
                   onError={(e) => e.currentTarget.style.display = 'none'}
                 />
                 <div className="absolute right-8 bottom-8 bg-secondary text-white font-black text-5xl p-6 rounded-full shadow-2xl transform -rotate-12 border-4 border-white/20 flex flex-col items-center justify-center w-32 h-32">
                   <span>20%</span>
                   <span className="text-xs font-bold uppercase tracking-widest mt-1">OFF</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h2>
              <p className="text-gray-500 mt-2 text-lg">Stock actualizado en tiempo real vía <span className="text-primary font-bold">Odoo ERP</span>.</p>
            </div>
            <div className="mt-6 md:mt-0 min-w-[200px]">
               <select className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-secondary transition-colors cursor-pointer font-medium">
                 <option>Más Vendidos</option>
                 <option>Menor Precio</option>
                 <option>Mayor Precio</option>
                 <option>Nombre (A-Z)</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="bg-white border-2 border-primary text-primary font-bold py-4 px-10 rounded-full hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-wide shadow-sm hover:shadow-lg">
              Cargar más productos
            </button>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form-section" className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Left Column: CTA Text */}
              <div className="lg:w-1/3">
                 <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                   <span className="w-2 h-8 bg-secondary rounded-sm"></span>
                   Hablemos de Limpieza
                 </h2>
                 <p className="text-gray-600 mb-6 leading-relaxed">
                   ¿Tienes un pedido especial o necesitas asesoría para tu empresa? Completa el formulario y nuestro equipo de ventas te contactará a la brevedad.
                 </p>
                 <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
                   <h4 className="font-bold text-primary mb-2">Beneficios Empresas</h4>
                   <ul className="space-y-2 text-sm text-gray-700">
                     <li className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       Facturación Inmediata (Odoo)
                     </li>
                     <li className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       Descuentos por Volumen
                     </li>
                     <li className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       Despacho Programado
                     </li>
                   </ul>
                 </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                  {contactStatus === 'success' && (
                    <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center animate-fade-in text-center p-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                      <p className="text-gray-600">Hemos recibido tu consulta. Te hemos enviado un correo de confirmación automáticamente.</p>
                      <button onClick={() => setContactStatus('idle')} className="mt-6 text-primary font-bold hover:underline">Volver al formulario</button>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          name="name"
                          required 
                          value={contactForm.name}
                          onChange={handleContactChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary focus:ring-0 outline-none transition-colors"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary focus:ring-0 outline-none transition-colors"
                          placeholder="+56 9 ..."
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input 
                          type="email" 
                          name="email"
                          required 
                          value={contactForm.email}
                          onChange={handleContactChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary focus:ring-0 outline-none transition-colors"
                          placeholder="correo@empresa.cl"
                        />
                      </div>
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                        <select 
                          name="subject"
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary focus:ring-0 outline-none transition-colors bg-white"
                        >
                          <option value="">Selecciona un motivo</option>
                          <option value="cotizacion">Cotización Formal</option>
                          <option value="mayorista">Compra Mayorista</option>
                          <option value="soporte">Soporte Técnico</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                      <textarea 
                        rows={4} 
                        name="message"
                        required
                        value={contactForm.message}
                        onChange={handleContactChange}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-secondary focus:ring-0 outline-none transition-colors resize-none"
                        placeholder="Cuéntanos en qué podemos ayudarte..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSendingContact}
                      className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-sky-700 transition-colors shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSendingContact ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Recibirás una copia automática en tu correo.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Footer */}
        <section id="footer-info" className="bg-gray-100 py-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-black text-xl">N</div>
                 <span className="text-2xl font-black text-primary">NUMO<span className="text-secondary">STOCK</span></span>
              </div>
              <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                Somos tu socio estratégico en insumos de higiene y limpieza. Distribuimos calidad y confianza a empresas de Arica a Punta Arenas.
              </p>
              
              <div className="mt-6">
                 <h5 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Síguenos en redes sociales</h5>
                 <div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-primary cursor-pointer hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-primary cursor-pointer hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <span className="text-secondary font-bold text-lg">@numostock</span>
                 </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Información</h4>
              <ul className="space-y-4 text-sm text-gray-600 font-medium">
                <li><a href="#" className="hover:text-secondary transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Zona de Despacho</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Políticas de Privacidad</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Trabaja con Nosotros</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Contáctanos</h4>
              <ul className="space-y-6 text-sm text-gray-600">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex flex-shrink-0 items-center justify-center text-secondary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Teléfono</span>
                    <span className="text-lg font-bold text-gray-800">+56 9 8584 9472</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-secondary/10 flex flex-shrink-0 items-center justify-center text-secondary">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Correo</span>
                    <span className="text-lg font-bold text-gray-800">hola@numostock.cl</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Bottom */}
        <footer className="bg-primary text-white py-8 border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
             <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} NumoStock SpA. Todos los derechos reservados.</p>
             <div className="flex items-center space-x-6">
               <span className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                 Sistema Odoo Conectado
               </span>
               <span className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                 Gemini AI Activo
               </span>
             </div>
           </div>
        </footer>

        {/* Modals & Drawers */}
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cart}
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
          onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        />

        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          onConfirm={handleCheckout}
          isProcessing={isProcessingOrder}
        />

        <AIAssistant products={products} onAddToCart={addToCart} />
      </div>
    </div>
  );
};

export default App;
