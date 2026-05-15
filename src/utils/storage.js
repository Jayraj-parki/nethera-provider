export function removeItem(key) {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
}
export function setItem(key, value) {
  if (typeof window === "undefined") return;    
    try {   
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.error("Failed to set item in localStorage", err);
    }   
}
export function getItem(key) {
  if (typeof window === "undefined") return null;   
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    catch (err) {
        console.error("Failed to get item from localStorage", err);
        return null;
    }
}
export function clearStorage() {
  if (typeof window === "undefined") return;
  localStorage.clear();
}
