import striptags from 'striptags';
import {manifest} from '@src/manifest.ts';
import {replace} from '@src/shared.ts';

export const pattern = '.xml';

const meta = {
  name: "tduyng.github.io",
  author: "Tien Duy NGUYEN",
  description: "Tien Duy NGUYEN’s Web Design &amp; Front-end Development Blog",
  url: "https://tduyng.github.io",
};

const url = new URL('/rss.xml', meta.url);

const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/assets/css/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{meta.name}}</title>
    <description>{{meta.description}}</description>
    <link>{{meta.url}}</link>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="{{url}}" rel="self" type="application/rss+xml"/>
    <author>{{meta.author}}</author>
    <language>en-GB</language>
{{entries}}</channel>
</rss>
`;

const entry = `<item>
  <title>{{title}}</title>
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
</item>
`;

export const GET = () => {
  const {latest} = manifest;

  let body = template;
  body = replace(body, `{{url}}`, url.href);
  body = replace(
    body,
    `{{lastBuildDate}}`,
    new Date(latest[0].date!).toUTCString()
  );
  for (const [key, value] of Object.entries(meta)) {
    body = body.replaceAll(`{{meta.${key}}}`, value);
  }

  const entries = latest.map((bookmark) => {
    let xml = entry;
    let html = bookmark.excerpt;
    html = striptags(html);
    const pubDate = new Date(bookmark.date!).toUTCString();
    const guid = new URL(bookmark.href, meta.url);
    xml = replace(xml, `{{title}}`, bookmark.title);
    xml = replace(xml, `{{description}}`, html);
    xml = replace(xml, `{{link}}`, guid.href);
    xml = replace(xml, `{{guid}}`, guid.href);
    xml = replace(xml, `{{pubDate}}`, pubDate);
    return xml;
  });

  body = replace(body, `{{entries}}`, entries.join(''));

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'content-length': body.length.toString()
    }
  });
};
