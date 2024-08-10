import { writable } from "svelte/store";

export const areBarsHidden = writable<boolean>(false);

export const toggleBars = () => {
  areBarsHidden.update((e) => !e)
}