import {manifest} from '@src/manifest.ts';
import type {DinoHandle} from 'dinossr';

export const middleware: DinoHandle = ({request, platform}) => {
  const url = new URL(request.url);

  // Setup DinoSsr platform data
  platform.publicData.deployHash = platform.deployHash;
  platform.publicData.title = "Tien Duy NGUYEN – Freelance Web Design (UK)";
  platform.serverData.styles = [...manifest.styles];

  // Skip headers for internal API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Known security policy headers
  const pageHeaders = [
    ['x-frame-options', 'DENY'],
    ['x-xss-protection', '1; mode=block'],
    ['x-content-type-options', 'nosniff'],
    ['permissions-policy', 'browsing-topics=(),interest-cohort=()'],
    ['referrer-policy', 'same-origin'],
    ['x-img-src', 'data:'],
    // ['x-style-src', `'sha256-${cssHash}'`],
    // TODO - generate? - Hash for Logo inline styles
    ['x-style-src', `'sha256-p0lVhHvjWu1bucdPJXr5SjN6e3hVy6Jv4paG9r+Nsbc='`],
    // TODO - generate? - Hash for inline App <head> script
    ['x-script-src', `'sha256-Rb2bGqrQbWB7CI5YFykBzKNjyi3IvTyaPuqR4q4mR8c='`]
  ];

  // Generated inline styles
  manifest.styles.forEach((style) => {
    pageHeaders.push(['x-style-src', `'sha256-${style.hash}'`]);
  });

  // CORS headers
  if (/\/(rss|sitemap)\.xml$/.test(url.pathname)) {
    pageHeaders.push(['access-control-allow-origin', '*']);
  } else {
    pageHeaders.push([
      "access-control-allow-origin",
      "https://tduyng.github.io",
    ]);
  }

  // Add strict security headers
  if (request.url.startsWith(Deno.env.get('ORIGIN')!)) {
    pageHeaders.push([
      'strict-transport-security',
      'max-age=63072000; includeSubDomains; preload'
    ]);
  }
  platform.serverData.pageHeaders = pageHeaders;
};
