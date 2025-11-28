
import React from 'react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onScrollToContact }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md">
      {/* Top Bar - Contact Info */}
      <div className="bg-primary text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-secondary">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              hola@numostock.cl
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-secondary">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.117.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              +56 9 8584 9472
            </span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-secondary transition-colors" onClick={(e) => e.preventDefault()}>Seguimiento de Orden</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-secondary transition-colors" onClick={(e) => e.preventDefault()}>Zona Mayorista</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-black text-2xl">N</div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-primary leading-none tracking-tight">NUMO<span className="text-secondary">STOCK</span></span>
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Distribución Profesional</span>
              </div>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Buscar productos (ej: cloro, guantes)..." 
                  className="w-full pl-4 pr-10 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-secondary transition-colors text-sm"
                />
                <button className="absolute right-0 top-0 h-full w-12 bg-secondary rounded-r-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <button className="hidden md:flex flex-col items-center text-gray-600 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-[10px] font-bold mt-1 uppercase">Mi Cuenta</span>
              </button>

              <button 
                onClick={onOpenCart}
                className="flex flex-col items-center text-gray-600 hover:text-primary transition-colors relative group"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 uppercase group-hover:text-secondary">Carro</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Secondary Menu (Categories) */}
        <div className="bg-gray-100 border-t border-gray-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-10 text-sm font-medium text-gray-700">
               <a href="#catalogo" onClick={(e) => handleScroll(e, 'catalogo')} className="hover:text-secondary flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                  </svg>
                 Todas las Categorías
               </a>
               <a href="#" className="hover:text-secondary" onClick={(e) => e.preventDefault()}>Limpieza Industrial</a>
               <a href="#" className="hover:text-secondary" onClick={(e) => e.preventDefault()}>Higiene y Papeles</a>
               <a href="#" className="hover:text-secondary" onClick={(e) => e.preventDefault()}>Dispensadores</a>
               <a href="#ofertas" onClick={(e) => handleScroll(e, 'ofertas')} className="text-secondary font-bold">OFERTAS DEL MES</a>
               <button onClick={onScrollToContact} className="ml-auto text-primary hover:underline">Servicio al Cliente</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
