export function debounce(callback: (value: any) => void, delay: number) {
  let timer: number;
  return function (...args: any[]) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback.call(this, args), delay);
  };
}
