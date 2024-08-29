<script lang="ts">
  import { areBarsHidden } from "../stores/hiddenBar";
  import BaseButton from "./BaseButton.svelte";

  // id is used to check which edit / delete button belongs to which entry
  interface Item {
    id: Date;
    name: string;
    canEdit: boolean;
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

  let {
    items = $bindable([]),
    saveState,
    isWheelShown = $bindable(),
  }: { items: Item[]; saveState: Function; isWheelShown: boolean } = $props();
  let wheelSize: number = $state(0);

  let handleClick = $state(() => {});

  $effect(() => {
    const canvas = document.getElementById("wheel")!;
    const height = canvas.offsetHeight;
    const width = canvas.offsetWidth;

    // Change the size of the wheel
    wheelSize = width > height ? height / 2 - 100 : width / 2 - 30;

    console.log(wheelSize);

    // @ts-ignore
    const ctx = canvas.getContext("2d");

    // radius of circle
    const r = wheelSize;

    const drawCircle = () => {
      // circle
      ctx.beginPath();
      ctx.arc(
        width / 2,
        height / 2,
        r,
        // fix visual bug by hidding it under the arrow
        0 + Math.PI * 1.5,
        Math.PI * 1.5 + 2 * Math.PI,
      );
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 10;
      ctx.stroke();
    };

    const drawSlices = (angleOffset: number = 0) => {
      // slice

      const sliceAngle = (2 * Math.PI) / items.length;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // line
        ctx.save();
        ctx.beginPath();

        // start and end angles for the slice
        const startAngle = sliceAngle * i + angleOffset;
        const endAngle = startAngle + sliceAngle;

        ctx.moveTo(width / 2, height / 2);
        // slice arc
        ctx.arc(width / 2, height / 2, r, startAngle, endAngle);
        // line
        ctx.lineTo(width / 2, height / 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        // item text
        ctx.font = `bold ${wheelSize / 16}px sans-serif`;
        ctx.textAlign = "end";
        ctx.save();
        // rotate text relative to slice
        ctx.translate(width / 2, height / 2);
        ctx.rotate(startAngle + sliceAngle / 2);

        ctx.fillStyle = "black";
        let tbr = "";
        if (item.name.length > 25) {
          tbr = "…";
        }
        // align text to middle from center to circle border
        ctx.fillText(
          `${item.name.slice(0, 25)}${tbr}`,
          r - (40 - item.name.length) * 1.5,
          0 + wheelSize / 16 / 1.5 / 2,
        );
        ctx.restore();
      }
    };

    const drawArrow = () => {
      // arrow
      ctx.beginPath();
      const arrowSize = wheelSize / 6 > 40 ? 40 : wheelSize / 5;
      // top half-circle
      ctx.arc(
        width / 2,
        height / 2 - r - arrowSize / 2,
        arrowSize / 2,
        Math.PI,
        0,
      );
      // bottom left of half circle
      ctx.moveTo(width / 2 - arrowSize / 2, height / 2 - r - arrowSize / 2);
      // to center and under half circle
      ctx.lineTo(width / 2, height / 2 - r + arrowSize / 2);
      // to bottom right of half circle
      ctx.lineTo(width / 2 + arrowSize / 2, height / 2 - r - arrowSize / 2);
      // draw the triangle under the half circle
      ctx.strokeStyle = "#800";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.closePath();
      ctx.fillStyle = "#f03060";
      ctx.fill();
    };

    drawCircle();
    drawSlices();
    drawArrow();

    // get a random value from 4*Math.PI to 9*Math.PI
    const randomRadian = () => Math.random() * 5 * Math.PI + 4 * Math.PI;
    let lastRadian = 0; // used to keep track where the wheel landed last time

    const cubicEaseInOut = (a: number) => {
      if (a < 0.5) {
        return 8 * a * a * a;
      } else {
        const b = a - 1;
        return 1 + 6 * b * b * b;
      }
    };
    let hasFinished = true;

    handleClick = () => {
      if (hasFinished) {
        hasFinished = false;
        const random = randomRadian();

        // animation duration
        const duration = 3000;

        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;

          // time from 0 to 1
          const time = Math.min(elapsed / duration, 3);

          const currentRadian = lastRadian + random * cubicEaseInOut(time);

          if (time < 1) {
            drawCircle();
            drawSlices(currentRadian);
            drawArrow();
            requestAnimationFrame(animate);
          } else {
            lastRadian += random;
            hasFinished = true;
          }
        };

        animate(startTime);
      }
    };
  });
</script>

<div class="h-full w-full flex flex-col items-center">
  <div class="flex justify-center items-center h-full">
    <canvas
      class="cursor-pointer"
      id="wheel"
      width={window.innerWidth}
      height={window.innerHeight - 96}
      onclick={handleClick}
    ></canvas>
  </div>
  <div
    class="flex gap-x-2 bg-white w-full justify-center py-2 {$areBarsHidden
      ? 'pos-fixed bottom-0 opacity-0 transition-all duration-200 hover:opacity-100'
      : ''}"
  >
    <div class="z-20">
      <BaseButton
        class="font-bold text-lg py-0.5 p-1 rd-md bg-slate-200 hover:bg-gray-300"
        onclick={() => {
          items = [];
          isWheelShown = false;
          saveState();
        }}>Delete all items</BaseButton
      >
    </div>
    <div>
      <BaseButton
        class="font-bold text-lg py-0.5 p-1 rd-md bg-slate-200 hover:bg-gray-300"
        onclick={() => {
          isWheelShown = false;
          saveState();
        }}>Edit items</BaseButton
      >
    </div>
  </div>
</div>
