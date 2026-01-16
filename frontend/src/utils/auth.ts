/**
 * Централизованная функция для выполнения logout
 * Очищает все данные авторизации и уведомляет компоненты приложения
 */
export const performLogout = () => {
  console.log("[performLogout] Starting logout process");
  
  // Очистка localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
  
  console.log("[performLogout] LocalStorage cleared");
  
  // Уведомление всех компонентов о logout через CustomEvent
  window.dispatchEvent(new CustomEvent("userLoggedOut"));
  
  console.log("[performLogout] userLoggedOut event dispatched");
};