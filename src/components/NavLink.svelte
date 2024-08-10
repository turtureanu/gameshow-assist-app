<script lang="ts">
  import BaseButton from "./BaseButton.svelte";
  import type { Snippet } from "svelte";

  let {
    href,
    class: className,
    children,
    ...props
  }: {
    href: string;
    class?: string;
    children: Snippet;
    [key: string]: any;
  } = $props();
</script>

<a
  {href}
  class="min-w-max flex justify-center items-center bg-slate-200 rd-md px-2 py-1 decoration-none text-black visited:text-black font-bold hover:(bg-gray-300) focus:(outline outline-blue outline-2) {className}"
  {...props}>{@render children()}</a
>
