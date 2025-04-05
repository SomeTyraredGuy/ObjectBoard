export const BASE_BOARD_URL = "http://127.0.0.1:3000/boards/"
export const CACHE_TIME = 5 * 1000 // 5 seconds
export const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
  };