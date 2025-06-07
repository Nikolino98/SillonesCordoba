
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedColor?: string) => void;
  removeItem: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, selectedColor?: string) => {
        set((state) => {
          const existingItem = state.items.find(
            item => item.product.id === product.id && item.selectedColor === selectedColor
          );
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id && item.selectedColor === selectedColor
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            return {
              items: [...state.items, { product, quantity: 1, selectedColor }]
            };
          }
        });
      },
      
      removeItem: (productId: string, selectedColor?: string) => {
        set((state) => ({
          items: state.items.filter(item => 
            !(item.product.id === productId && item.selectedColor === selectedColor)
          )
        }));
      },
      
      updateQuantity: (productId: string, quantity: number, selectedColor?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId && item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
