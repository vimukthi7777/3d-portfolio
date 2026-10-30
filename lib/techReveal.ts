/**
 * The Services section waits until the "Technologies I work with" chips are fully revealed,
 * so jumping or scrolling quickly past About never shows Services first.
 */
const EVENT = "tech-revealed";

export function markTechRevealed() {
  document.documentElement.dataset.techRevealed = "true";
  window.dispatchEvent(new Event(EVENT));
}

/** Runs `callback` once the chips are revealed (immediately if they already are). Returns a cleanup. */
export function onTechRevealed(callback: () => void): () => void {
  if (document.documentElement.dataset.techRevealed === "true") {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}

/** Per-row reveal: each technologies row can start its marquee as soon as that row has appeared. */
const ROW_EVENT = "tech-row-revealed";

export function markRowRevealed(index: number) {
  document.documentElement.dataset[`techRow${index}`] = "true";
  window.dispatchEvent(new CustomEvent<number>(ROW_EVENT, { detail: index }));
}

/** Runs `callback` once row `index` is revealed (immediately if it already is). Returns a cleanup. */
export function onRowRevealed(index: number, callback: () => void): () => void {
  if (document.documentElement.dataset[`techRow${index}`] === "true") {
    callback();
    return () => {};
  }
  const listener = (e: Event) => {
    if ((e as CustomEvent<number>).detail === index) {
      window.removeEventListener(ROW_EVENT, listener);
      callback();
    }
  };
  window.addEventListener(ROW_EVENT, listener);
  return () => window.removeEventListener(ROW_EVENT, listener);
}
