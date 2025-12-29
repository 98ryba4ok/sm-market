export const DEFAULT_SIBLING_COUNT = 1;
export const DEFAULT_SHOW_FIRST_LAST = true;
export const DEFAULT_IS_LOADING = false;

export const PAGINATION_ARIA_LABELS = {
  navigation: 'Pagination',
  previous: 'Go to previous page',
  next: 'Go to next page',
  page: (page: number) => `Go to page ${page}`,
  currentPage: 'page',
} as const;