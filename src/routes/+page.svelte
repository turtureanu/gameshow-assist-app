<script>
  import NavLink from "../components/NavLink.svelte";
</script>

<div
  class="flex flex-col md:flex-row justify-center items-center h-full gap-4 text-3xl"
  aria-label="menu"
>
  <NavLink
    class="outline-6 hover:outline hover:outline-lightblue p-16 bg-gradient-to-tr bg-gradient-from-teal-100 bg-gradient-to-blue-200"
    href="/keep-the-score">Keep the Score</NavLink
  >
  <NavLink
    class="outline-6 hover:outline hover:outline-red p-16 bg-gradient-to-tr bg-gradient-from-violet-100 bg-gradient-to-red-200"
    href="/wheel">Spin the wheel</NavLink
  >
</div>
