/** Lets the hero wait for the page loader to leave before it plays its entrance animation. */
const EVENT = "loader-done";

export function markLoaderDone() {
  document.documentElement.dataset.loaderDone = "true";
  window.dispatchEvent(new Event(EVENT));
}

/** Runs `callback` once the loader is gone (immediately if it already is). Returns a cleanup. */
export function onLoaderDone(callback: () => void): () => void {
  if (document.documentElement.dataset.loaderDone === "true") {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}
