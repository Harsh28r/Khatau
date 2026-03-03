declare module 'lodash.debounce' {
  function debounce<T extends (...args: any[]) => any>(func: T, wait?: number): T & { cancel(): void; flush(): void }
  export default debounce
}
