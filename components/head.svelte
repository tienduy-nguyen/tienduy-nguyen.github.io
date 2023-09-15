<script>
  import {getContext} from 'svelte';

  const publicData = getContext('publicData');
  let {title, href, description} = getContext('serverData')?.props ?? {};

  href = href ?? '/';
  let pageTitle = publicData.title;
  let pageDescription = description ?? publicData.title;
  if (title) {
    pageTitle = `${title} – ${pageTitle}`;
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <link rel="canonical" href="https://tduyng.github.io{href}" />
  <meta name="description" content={pageDescription}>
  <meta property="og:title" content={pageTitle} />
  <meta property="og:url" content="https://tduyng.github.io{href}" />
  <meta property="og:description" content={pageDescription} />
  <meta
    property="og:image"
    content="https://tduyng.github.io/assets/icons/512x512.png"
  />
  <meta property="og:site_name" content="tduyng.github.io" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@tduyng" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta
    name="twitter:image"
    content="https://tduyng.github.io/assets/icons/512x512.png"
  />
</svelte:head>
