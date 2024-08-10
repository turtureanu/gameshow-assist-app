<script lang="ts">
  import NavLink from "../components/NavLink.svelte";
  import BaseButton from "../components/BaseButton.svelte";
  import Icon from "@iconify/svelte";
  import screenfull from "screenfull";

  import { areBarsHidden, toggleBars } from "../stores/hiddenBar";

  let isFullscreen = $state(screenfull.isFullscreen);

  const toggleFullscreen = async () => {
    if (screenfull.isEnabled) {
      await screenfull.toggle();

      screenfull.isFullscreen ? (isFullscreen = true) : (isFullscreen = false);
    }
  };
</script>

<nav
  class="z-10 w-full flex justify-center md:justify-between flex-wrap bg-slate-100 {$areBarsHidden &&
    'pos-fixed top-0 opacity-0 transition-all duration-200 hover:opacity-100'}"
>
  <div class="flex gap-2 p-2">
    <NavLink href="/keep-the-score">Keep the Score</NavLink>
    <NavLink href="/wheel">Spin the Wheel</NavLink>
  </div>
  <div class="flex items-center p-2">
    <div class="ml-a w-min h-min flex gap-2">
      <BaseButton
        class="py-1 px-2 hover:(bg-gray-300) pr-2 text-md font-bold w-max flex items-center bg-slate-200 rd-lg cursor-pointer"
        onclick={toggleBars}
      >
        {#if $areBarsHidden}
          <Icon class="mx-1 text-2xl" icon="mdi:show" />Show bar
        {:else}
          <Icon class="mx-1 text-2xl" icon="mdi:hide" />Hide bar
        {/if}
      </BaseButton>
      <BaseButton
        class="py-1 px-2 hover:(bg-gray-300) pr-2 text-md font-bold w-max flex items-center bg-slate-200 rd-lg cursor-pointer"
        onclick={toggleFullscreen}
      >
        {#if isFullscreen}
          <Icon class="mx-1 text-2xl" icon="bx-exit-fullscreen" />Exit
          Fullscreen
        {:else}
          <Icon class="mx-1 text-2xl" icon="bx-fullscreen" />Fullscreen
        {/if}
      </BaseButton>
    </div>
  </div>
</nav>
