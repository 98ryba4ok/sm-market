export const calculateDiscountPercentage = (
  price: string,
  discountPrice: string | null | undefined
): number => {
  if (!discountPrice) return 0;
  
  const priceNum = Number(price);
  const discountNum = Number(discountPrice);
  
  if (priceNum <= 0 || discountNum >= priceNum) return 0;
  
  return Math.round(((priceNum - discountNum) / priceNum) * 100);
};

export const getProductImage = (mainImage: string | null | undefined, placeholder: string): string => {
  return mainImage || placeholder;
};