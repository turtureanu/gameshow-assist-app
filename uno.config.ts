import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    btn: "appearance-none border-none bg-[unset] m-0 p-0 cursor-pointer",
  },
  rules: [
    ['text-overflow', {
      "word-wrap": "break-word",
      "white-space": "pre-wrap",
      "word-break": "break-word"
    }]
  ]
});
