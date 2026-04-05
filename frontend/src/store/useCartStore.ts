import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}

interface CartState {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: any, quantity: number) => void;
  removeItem: (id: any) => void;
  updateQuantity: (id: any, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (product, quantity) => {
        if (!product || !product.id) {
          console.error('Invalid product for addItem:', product);
          return;
        }

        const productId = Number(product.id);
        const { items } = get();
        const existingItem = items.find((item) => Number(item.id) === productId);

        console.log('Sepete eklenen ürün:', product, 'Adet:', quantity);

        if (existingItem) {
          set({
            items: items.map((item) =>
              Number(item.id) === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: productId,
                name: product.name,
                price: Number(product.price),
                image: product.image_urls?.[0] || product.image || 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus',
                quantity,
                sku: product.sku || 'N/A',
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        const targetId = Number(id);
        set({
          items: get().items.filter((item) => Number(item.id) !== targetId),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        const targetId = Number(id);
        set({
          items: get().items.map((item) =>
            Number(item.id) === targetId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'technocus-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (!error && state) {
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);
