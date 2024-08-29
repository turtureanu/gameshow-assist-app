<script lang="ts">
  import Icon from "@iconify/svelte";
  import BaseButton from "../../components/BaseButton.svelte";
  import { fade, slide } from "svelte/transition";
  import { areBarsHidden } from "../../stores/hiddenBar";
  import { tick } from "svelte";

  let ref: HTMLInputElement | undefined = $state();

  // id is used to check which edit / delete button belongs to which entry
  interface Team {
    id: Date;
    name: string;
    canEdit: boolean;
    score: number;
  }

  // Colors to distinguish teams
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

  // There is no way to auto-expand items on a new row so I need it needs to be done manually
  // or wait till this draft gets into the standard: https://github.com/w3c/csswg-drafts/issues/1373
  const getElementMaxWidth = (teamCount: number, index: number) => {
    switch (teamCount) {
      case 2:
        return "50%";
      case 3:
        return "33.333%";
      case 4:
        return index <= 2 ? "33.333%" : "100%;";
      case 5:
        return index <= 2 ? "33.333%" : "50%";
      case 6:
        return "33.333%";
      case 7:
        return index <= 3 ? "25%" : "33.333%";
      case 8:
        return "25%";
      // no need for default
    }
  };

  let teams: Team[] = $state([]);

  let newTeamName: string = $state.raw("");

  let areTooManyTeams: boolean = $state.raw(false);

  // check for a duplicate name entry
  // then add the entry to the array
  const addTeam = () => {
    if (teams.length !== 8) {
      let isDuplicate = teams.some((team) => team.name === newTeamName);

      if (newTeamName.trim() && !isDuplicate) {
        teams = [
          ...teams,
          { id: new Date(), name: newTeamName, canEdit: false, score: 0 },
        ];
        newTeamName = "";
        saveState();
      }
    } else {
      areTooManyTeams = true;
      setTimeout(() => (areTooManyTeams = false), 2000);
    }
  };

  // Team count screen
  let isCountingShown = $state(false);

  const saveState = () => {
    localStorage.setItem("teams", JSON.stringify(teams));
    localStorage.setItem("isCountingShown", JSON.stringify(isCountingShown));
  };

  const readState = () => {
    if (localStorage.length !== 0) {
      const readTeams = localStorage.getItem("teams");
      teams = readTeams ? JSON.parse(readTeams) : [];

      let readCount = localStorage.getItem("isCountingShown");
      if (readCount !== null) {
        isCountingShown = JSON.parse(readCount);
      }
    }
  };

  $effect(readState);
</script>

<!-- Add teams -->

{#if !isCountingShown}
  <div class="h-full" in:fade={{ duration: 200 }}>
    <div
      class="flex flex-col justify-start items-center m-auto w-full {$areBarsHidden
        ? 'pt-32'
        : 'pt-20'}"
    >
      <form
        onsubmit={(e: Event) => {
          e.preventDefault();
          addTeam();
        }}
        class="w-full"
      >
        <div
          class="m-auto w-full max-w-sm flex items-center transition-all transition-delay-300"
        >
          <label
            for="team-name"
            class="w-full h-full py-4 px-4 bg-slate-200 hover:bg-gray-200 rd-tl-md rd-bl-md"
          >
            <div class="w-full h-full">
              <!-- svelte-ignore a11y_autofocus -->
              <input
                autofocus
                class="text-xl btn cursor-default h-full w-full outline-none font-bold b-b-transparent b-b-3 b-b-dotted focus:(bg-gray-200 b-b-gray-400)"
                type="text"
                placeholder="Team name"
                required
                name="team-name"
                id="team-name"
                bind:value={newTeamName}
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
      {#if areTooManyTeams}
        <div
          in:fade={{ duration: 200 }}
          out:fade={{ duration: 200 }}
          class="text-xl mt-5 font-bold italic"
        >
          Can't add more teams!
        </div>
      {/if}
      <div class="w-full max-w-sm">
        <BaseButton
          class="p-2 text-3xl w-full bg-gray-300 rd-lg mt-6 {teams.length > 1
            ? 'font-bold bg-green-200 hover:bg-green-300 cursor-pointer'
            : 'italic cursor-auto'}"
          onclick={() => {
            if (teams.length > 1) isCountingShown = !isCountingShown;
            saveState();
          }}>Start counting</BaseButton
        >
      </div>
      <form onsubmit={(e: Event) => e.preventDefault()} class="w-full">
        <div class="mt-20 w-full">
          {#each teams as team, i (team.id)}
            <div class="w-full max-w-xl mx-auto">
              <div
                class="flex justify-between items-center gap-x-2 rd-lg mx-5 mb-6"
                style="background-color: {colors[i % colors.length]}"
                in:fade={{ duration: 150 }}
                out:fade={{ duration: 150 }}
              >
                {#if team.canEdit}
                  <input
                    class="btn text-3xl font-bold ml-2 my-2 p-2 w-full resize-none h-full focus:(outline-none b-b-3 b-b-white b-b-solid)"
                    bind:value={team.name}
                    disabled={!team.canEdit}
                    bind:this={ref}
                    required
                    name="team-name"
                    id="team-{team.name}"
                  />
                {:else}
                  <div
                    class="btn text-4xl font-bold pl-4 py-2 rd-lg w-full resize-none h-full text-overflow"
                  >
                    {team.name}
                  </div>
                {/if}
                <div class="flex gap-x-2 m-2">
                  <label for="team-{team.name}">
                    {#if team.canEdit === false}
                      <div
                        class="flex justify-center items-center min-w-[55px] h-[55px]"
                      >
                        <BaseButton
                          class="text-2xl flex justify-center items-center p-2 rd-lg w-full h-full bg-white hover:bg-yellow-200"
                          onclick={async () => {
                            team.canEdit = true;
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
                            if (team.name.trim()) {
                              team.canEdit = false;
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
                      onclick={() =>
                        (teams = [
                          ...teams.filter((e) => e.name !== team.name),
                        ])}
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
  <!-- Display teams -->
{:else}
  <div
    class="flex flex-col h-full z-0"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <div class="flex flex-wrap text-3xl h-full w-full">
      {#each teams as team, i (team.id)}
        <div
          class="w-full flex flex-col justify-center"
          style="background-color: {colors[
            i % colors.length
          ]}; max-width: {getElementMaxWidth(teams.length, i)}"
        >
          <div class="mb-20 w-full">
            <div
              class="px-10 py-5 leading-16 text-6xl text-center text-overflow"
            >
              {team.name}
            </div>
          </div>
          <div class="text-6xl flex justify-between items-center w-full">
            <BaseButton
              class="py-5 hover:text-slate-500 text-center font-bold w-full block text-5xl"
              onclick={() => {
                team.score -= 1;
                saveState();
              }}>-</BaseButton
            >
            <div class="min-m-max text-center font-mono text-8xl">
              {team.score}
            </div>
            <BaseButton
              class="py-5 hover:text-slate-500 text-center w-full block text-5xl"
              onclick={() => {
                team.score += 1;
                saveState();
              }}>+</BaseButton
            >
          </div>
        </div>
      {/each}
    </div>
    <div
      class="flex gap-x-2 bg-white w-full justify-center py-2 {$areBarsHidden
        ? 'pos-fixed bottom-0 opacity-0 transition-all duration-200 hover:opacity-100'
        : ''}"
    >
      <div>
        <BaseButton
          class="font-bold text-lg py-0.5 p-1 rd-md bg-slate-200 hover:bg-gray-300"
          onclick={() => {
            teams = [];
            isCountingShown = false;
            saveState();
          }}>Delete teams</BaseButton
        >
      </div>
      <div>
        <BaseButton
          class="font-bold text-lg py-0.5 p-1 rd-md bg-slate-200 hover:bg-gray-300"
          onclick={() => {
            isCountingShown = false;
            saveState();
          }}>Edit team names</BaseButton
        >
      </div>
      <div class="flex items-center gap-5">
        <BaseButton
          onclick={() => {
            teams.forEach((team) => (team.score = 0));
            saveState();
          }}
          class="font-bold text-lg py-0.5 p-1 rd-md bg-slate-200 hover:bg-gray-300"
          >Reset scores</BaseButton
        >
      </div>
    </div>
  </div>
{/if}
