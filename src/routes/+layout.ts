export const ssr = false;
export const prerender = true;

// Thanks to this article, we have page transitions: https://joshcollinsworth.com/blog/sveltekit-page-transitions
export const load = ({ url }) => {
  const { pathname } = url;

  return {
    pathname,
  };
};
