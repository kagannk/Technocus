import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const cartInfo = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...cartInfo,
    isHydrated: isHydrated && cartInfo._hasHydrated,
  };
};
