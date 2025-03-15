// frontend/stores/cart.ts
import { defineStore } from "pinia";
import { computed } from "vue";

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

function ensureNumber(value: any): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    cartCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    addItem(product: CartItem) {
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product });
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    removeItem(productId: number) {
      this.items = this.items.filter((item) => item.id !== productId);
    },

    clearCart() {
      this.items = [];
    },
  },
});

const subtotal = computed(() => {
  return useCartStore().items.reduce((total, item) => {
    return total + ensureNumber(item.price) * ensureNumber(item.quantity);
  }, 0);
});
