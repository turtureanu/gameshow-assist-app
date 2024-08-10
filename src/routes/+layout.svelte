<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import Nav from "../layout/Nav.svelte";

  let {data, children}: {data: any, children: Snippet} = $props();

</script>

{#if data.pathname !== "/"}
  <Nav />
{/if}

{#key data.pathname}
  <div in:fade={{ delay: 150, duration: 150 }} out:fade={{ duration: 150 }} class="h-full">
    {@render children()}
  </div>
{/key}
