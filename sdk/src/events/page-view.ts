import { SendCallback } from "../transport";

export function pageView(send: SendCallback) {
  send("page-view", {
    title: document.title,
    url: window.location.href,
  });
}
