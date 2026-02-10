export function register() {
    // Node.js v25+ exposes a broken localStorage global (getItem is not a function)
    // when --localstorage-file is not properly configured. Remove it to prevent
    // SSR crashes in React/Next.js.
    if (typeof window === 'undefined' && typeof localStorage !== 'undefined') {
        if (typeof localStorage.getItem !== 'function') {
            delete globalThis.localStorage;
        }
    }
}
