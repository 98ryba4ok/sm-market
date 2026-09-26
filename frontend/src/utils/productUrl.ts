// Numeric slugs are ambiguous with IDs in the product API.
export const productUrl = (product: { id: number; slug: string }): string =>
  `/products/${/^\d+$/.test(product.slug) ? product.id : product.slug}`;
