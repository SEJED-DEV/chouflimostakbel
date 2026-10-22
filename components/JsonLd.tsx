/**
 * A JSON-LD block.
 *
 * One place that knows how to put a schema.org object on a page, so every
 * page that has one does it the same way and none of them has to remember
 * the escaping.
 *
 * The content is JSON, not HTML, and it goes inside a script tag whose type
 * says so. The one thing that matters is that a `<` inside the JSON cannot
 * end the script tag early and turn the rest of the object into markup, so
 * the characters that could do it are escaped.
 */
export default function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data)
    // `<` would close the script tag. So would a sequence that a browser
    // reads as the start of one.
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      // The content is JSON built here, from strings this site controls. It
      // is not user input being injected into markup.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
