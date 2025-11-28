import { Product } from './types';

// Using a mix of Unsplash and reliable fallbacks if these fail via the component logic
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cloro Gel Industrial 5L',
    description: 'Desinfectante de alta potencia para superficies difíciles. Ideal para baños y cocinas industriales.',
    price: 4500,
    stock: 50,
    rop: 10,
    category: 'Desinfectantes',
    imageUrl: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    name: 'Detergente Multiuso Floral 5L',
    description: 'Limpiador versátil con aroma persistente. No deja residuos en pisos flotantes o cerámica.',
    price: 3200,
    stock: 12,
    rop: 15, // Low stock simulation
    category: 'Limpieza General',
    imageUrl: 'https://images.unsplash.com/photo-1528740561666-dc24705f08a7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p3',
    name: 'Pack Paños Microfibra (10u)',
    description: 'Paños de alta absorción que no rayan las superficies. Colores surtidos para evitar contaminación cruzada.',
    price: 8990,
    stock: 100,
    rop: 20,
    category: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1581578731117-104f2a923227?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p4',
    name: 'Desengrasante Biodegradable',
    description: 'Fórmula ecológica potente contra la grasa quemada en cocinas industriales.',
    price: 6500,
    stock: 30,
    rop: 5,
    category: 'Cocina',
    imageUrl: 'https://images.unsplash.com/photo-1585670149962-e952c72b214a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p5',
    name: 'Limpiavidrios Antiestático 5L',
    description: 'Deja tus vidrios y espejos brillantes y repele el polvo por más tiempo.',
    price: 2800,
    stock: 45,
    rop: 10,
    category: 'Vidrios',
    imageUrl: 'https://images.unsplash.com/photo-1624538059083-d34556488737?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p6',
    name: 'Alcohol Gel 70% 1L',
    description: 'Higienizante de manos de secado rápido con aloe vera. Registro ISP.',
    price: 3500,
    stock: 200,
    rop: 50,
    category: 'Higiene Personal',
    imageUrl: 'https://images.unsplash.com/photo-1584483766114-2cea6facb57c?auto=format&fit=crop&w=800&q=80'
  }
];