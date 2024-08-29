<script lang="ts">
  import Icon from "@iconify/svelte";
  import BaseButton from "../../components/BaseButton.svelte";
  import { fade } from "svelte/transition";
  import { tick } from "svelte";
  import Wheel from "../../components/Wheel.svelte";
  import { areBarsHidden } from "../../stores/hiddenBar";

  let ref: HTMLInputElement | undefined = $state();

  // id is used to check which edit / delete button belongs to which entry
  interface Item {
    id: Date;
    name: string;
    canEdit: boolean;
  }

  // Colors to distinguish items
  const colors = [
    "hsl(340, 70%, 70%)", // Pink
    "hsl(210, 95%, 75%)", // Blue
    "hsl(130, 60%, 70%)", // Green
    "hsl(50, 90%, 70%)", // Yellow
    "hsl(150, 80%, 80%)", // Light Green
    "hsl(40, 80%, 65%)", // Orange
    "hsl(0, 100%, 80%)", // Light Red
    "hsl(270, 60%, 80%)", // Purple
  ];

  let items: Item[] = $state([]);

  let newItemName: string = $state.raw("");

  let areTooManyitems: boolean = $state.raw(false);

  // check for a duplicate name entry
  // then add the entry to the array
  const addItem = () => {
    if (items.length !== 8) {
      let isDuplicate = items.some((item) => item.name === newItemName);

      if (newItemName.trim() && !isDuplicate) {
        items = [
          ...items,
          { id: new Date(), name: newItemName, canEdit: false },
        ];
        newItemName = "";
        saveState();
      }
    } else {
      areTooManyitems = true;
      setTimeout(() => (areTooManyitems = false), 2000);
    }
  };

  // Wheel screen
  let isWheelShown = $state(false);

  const saveState = () => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("isWheelShown", JSON.stringify(isWheelShown));
  };

  const readState = () => {
    if (localStorage.length !== 0) {
      const readitems = localStorage.getItem("items");
      items = readitems ? JSON.parse(readitems) : [];

      let readCount = localStorage.getItem("isWheelShown");
      if (readCount !== null) {
        isWheelShown = JSON.parse(readCount);
      }
    }
  };

  $effect(readState);
</script>

<!-- Add items -->

{#if isWheelShown !== true}
  <div class="h-full" in:fade={{ duration: 200 }}>
    <div
      class="flex flex-col justify-start items-center m-auto w-full {$areBarsHidden
        ? 'pt-32'
        : 'pt-20'}"
    >
      <form
        onsubmit={(e: Event) => {
          e.preventDefault();
          addItem();
        }}
        class="w-full"
      >
        <div
          class="m-auto w-full max-w-sm flex items-center transition-all transition-delay-300"
        >
          <label
            for="item-name"
            class="w-full h-full py-4 px-4 bg-slate-200 hover:bg-gray-200 rd-tl-md rd-bl-md"
          >
            <div class="w-full h-full">
              <!-- svelte-ignore a11y_autofocus -->
              <input
                autofocus
                class="text-xl btn cursor-default h-full w-full outline-none font-bold b-b-transparent b-b-3 b-b-dotted focus:(bg-gray-200 b-b-gray-400)"
                type="text"
                placeholder="Item name"
                required
                name="item-name"
                id="item-name"
                bind:value={newItemName}
              />
            </div>
          </label>
          <div class="flex justify-center items-center">
            <BaseButton
              class="text-4xl flex items-center justify-center w-full p-3.375 h-full rd-tr-md rd-br-md bg-green-200 hover:bg-green-300"
              action="submit"
            >
              <Icon icon="ic:baseline-plus" />
            </BaseButton>
          </div>
        </div>
      </form>
      {#if areTooManyitems}
        <div
          in:fade={{ duration: 200 }}
          out:fade={{ duration: 200 }}
          class="text-xl mt-5 font-bold italic"
        >
          Can't add more items!
        </div>
      {/if}
      <div class="w-full max-w-sm">
        <BaseButton
          class="p-2 text-3xl w-full bg-gray-300 rd-lg mt-6 {items.length > 1
            ? 'font-bold bg-green-200 hover:bg-green-300 cursor-pointer'
            : 'italic cursor-auto'}"
          onclick={() => {
            if (items.length > 1) isWheelShown = !isWheelShown;
            saveState();
          }}>Done</BaseButton
        >
      </div>
      <form onsubmit={(e: Event) => e.preventDefault()} class="w-full">
        <div class="mt-20 w-full">
          {#each items as item, i (item.id)}
            <div class="w-full max-w-xl mx-auto">
              <div
                class="flex justify-between items-center gap-x-2 rd-lg mx-5 mb-6"
                style="background-color: {colors[i % colors.length]}"
                in:fade={{ duration: 150 }}
                out:fade={{ duration: 150 }}
              >
                {#if item.canEdit}
                  <input
                    class="btn text-3xl font-bold ml-2 my-2 p-2 w-full resize-none h-full focus:(outline-none b-b-3 b-b-white b-b-solid)"
                    bind:value={item.name}
                    disabled={!item.canEdit}
                    bind:this={ref}
                    required
                    name="item-name"
                    id="item-{item.name}"
                  />
                {:else}
                  <div
                    class="btn text-4xl font-bold pl-4 py-2 rd-lg w-full resize-none h-full text-overflow"
                  >
                    {item.name}
                  </div>
                {/if}
                <div class="flex gap-x-2 m-2">
                  <label for="item-{item.name}">
                    {#if item.canEdit === false}
                      <div
                        class="flex justify-center items-center min-w-[55px] h-[55px]"
                      >
                        <BaseButton
                          class="text-2xl flex justify-center items-center p-2 rd-lg w-full h-full bg-white hover:bg-yellow-200"
                          onclick={async () => {
                            item.canEdit = true;
                            await tick();
                            ref?.focus();
                          }}
                        >
                          <Icon icon="fa6-solid:pencil" />
                        </BaseButton>
                      </div>
                    {:else}
                      <div
                        class="flex justify-center items-center min-w-[55px] h-[55px]"
                      >
                        <BaseButton
                          class="text-2xl flex justify-center items-center p-2 rd-lg w-full h-full bg-white hover:bg-green-200"
                          onclick={() => {
                            if (item.name.trim()) {
                              item.canEdit = false;
                            }
                          }}
                          action="submit"
                        >
                          <Icon icon="fa-solid:check" />
                        </BaseButton>
                      </div>
                    {/if}
                  </label>
                  <div
                    class="flex justify-center items-center min-w-[55px] h-[55px]"
                  >
                    <BaseButton
                      class="text-2xl flex justify-center items-center p-2 rd-lg w-full h-full bg-white hover:bg-red-200"
                      onclick={() => {
                        items = [...items.filter((e) => e.name !== item.name)];
                        saveState();
                      }}
                    >
                      <Icon icon="fa6-solid:trash" />
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </form>
    </div>
  </div>
  <!-- Display items -->
{:else}
  <Wheel bind:isWheelShown {saveState} bind:items />
{/if}
