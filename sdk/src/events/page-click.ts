import { SendCallback } from "../transport";

export function trackPageClick(send: SendCallback) {
  document.addEventListener("click", (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest(
      "[data-track]",
    ) as HTMLElement | null;
    if (!el) return;
    send("page-click", {
      label: el.dataset.track,
      text: el.innerText?.slice(0, 50),
    });
  });
}
