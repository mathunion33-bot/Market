import { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'refrigerantes', name: 'Refrigerantes', icon: 'CupSoda' },
  { id: 'energeticos', name: 'Energéticos', icon: 'Zap' },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie' },
  { id: 'chocolates', name: 'Chocolates', icon: 'Box' },
  { id: 'bebidas', name: 'Bebidas', icon: 'Milk' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'coca-cola-350ml',
    name: 'Coca-Cola Latinha 350ml',
    description: 'Refrigerante de cola refrescante.',
    price: 4.5,
    oldPrice: 6.0,
    internalPrice: 2.5,
    category: 'refrigerantes',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    stock: 50,
    popular: true,
  },
  {
    id: 'red-bull-250ml',
    name: 'Red Bull Energy Drink 250ml',
    description: 'Energético que te dá asas.',
    price: 9.5,
    oldPrice: 12.0,
    internalPrice: 6.5,
    category: 'energeticos',
    image: 'https://images.unsplash.com/photo-1622484210982-f5421da6d296?q=80&w=800&auto=format&fit=crop',
    stock: 30,
    popular: true,
  },
  {
    id: 'batata-lays-classica',
    name: 'Batata Lays Clássica 80g',
    description: 'Batata frita crocante e salgadinha.',
    price: 7.0,
    oldPrice: 9.5,
    internalPrice: 4.0,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=800&auto=format&fit=crop',
    stock: 25,
  },
  {
    id: 'kit-kat-45g',
    name: 'Kit Kat 45g',
    description: 'Chocolate com wafer crocante.',
    price: 3.5,
    oldPrice: 5.0,
    internalPrice: 2.0,
    category: 'chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop',
    stock: 40,
    popular: true,
  },
];
