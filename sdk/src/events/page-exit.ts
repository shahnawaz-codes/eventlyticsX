import { SendCallback } from "../transport";

export function pageExit(send: SendCallback, startTime: number) {
  window.addEventListener("beforeunload", () => {
    send("page-exit", {
      duration: Math.round((Date.now() - startTime) / 1000),
    });
  });
}
