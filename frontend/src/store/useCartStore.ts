import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';
import { getStorageItem } from '@/lib/auth';

export interface CartItem {
  id: number;
  productId?: number;
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
  addItem: (product: any, quantity: number) => Promise<void>;
  removeItem: (id: any) => Promise<void>;
  updateQuantity: (id: any, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
  syncGuestCart: () => Promise<void>;
}

const hasToken = () => !!getStorageItem("token");

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      fetchCart: async () => {
        if (!hasToken()) return;
        try {
          const data = await apiFetch('/api/cart');
          const mappedItems = data.map((item: any) => ({
            id: item.id, // the cart_item id
            productId: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            image: item.product.image_urls?.[0] || 'https://placehold.co/400x400/eaeff4/1b243b?text=Technocus',
            quantity: item.quantity,
            sku: item.product.sku || 'N/A',
          }));
          set({ items: mappedItems });
        } catch (error) {
          console.error("fetchCart error:", error);
        }
      },

      syncGuestCart: async () => {
        const { items } = get();
        if (items.length === 0 || !hasToken()) return;

        try {
          // GUEST CART: items have id as productId.
          // BACKEND CART: items have id as cartItemId and productId as product_id.
          for (const item of items) {
            // For guest cart items, id is the product_id. If it has productId, it's already a backend item.
            const pid = (item as any).productId || item.id;
            await apiFetch('/api/cart', {
              method: 'POST',
              body: JSON.stringify({ product_id: pid, quantity: item.quantity })
            });
          }
          // After merging, fetch the fresh backend cart
          await get().fetchCart();
        } catch (error) {
          console.error("syncGuestCart error:", error);
        }
      },

      addItem: async (product, quantity) => {
        if (!product || !product.id) return;

        if (hasToken()) {
          try {
            await apiFetch('/api/cart', {
              method: 'POST',
              body: JSON.stringify({ product_id: product.id, quantity })
            });
            await get().fetchCart();
          } catch (error) {
            console.error("addItem API error:", error);
          }
        } else {
          // Guest Cart behavior
          const productId = Number(product.id);
          const { items } = get();
          const existingItem = items.find((item) => Number(item.id) === productId);

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
        }
      },

      removeItem: async (id) => {
        if (hasToken()) {
          try {
            await apiFetch(`/api/cart/${id}`, { method: 'DELETE' });
            await get().fetchCart();
          } catch (error) {
            console.error("removeItem API error:", error);
          }
        } else {
          const targetId = Number(id);
          set({
            items: get().items.filter((item) => Number(item.id) !== targetId),
          });
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity < 1) return;
        
        if (hasToken()) {
          try {
            await apiFetch(`/api/cart/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ quantity })
            });
            await get().fetchCart();
          } catch (error) {
            console.error("updateQuantity API error:", error);
          }
        } else {
          const targetId = Number(id);
          set({
            items: get().items.map((item) =>
              Number(item.id) === targetId ? { ...item, quantity } : item
            ),
          });
        }
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
            if (hasToken()) {
              // Try to sync on load if logged in (in case there's a delay)
              state.fetchCart();
            }
          }
        };
      },
    }
  )
);
