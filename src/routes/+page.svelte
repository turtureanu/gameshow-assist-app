<script>
  import NavLink from "../components/NavLink.svelte";
</script>

<div
  class="flex justify-center items-center h-full gap-x-4 text-3xl"
  aria-label="menu"
>
  <NavLink
    class="outline-6 hover:outline hover:outline-lightblue p-20 bg-gradient-to-tr bg-gradient-from-teal-100 bg-gradient-to-blue-200"
    href="/keep-the-score">Keep the Score</NavLink
  >
  <NavLink
    class="outline-6 hover:outline hover:outline-red p-20 bg-gradient-to-tr bg-gradient-from-violet-100 bg-gradient-to-red-200"
    href="/wheel">Spin the wheel</NavLink
  >
</div>
