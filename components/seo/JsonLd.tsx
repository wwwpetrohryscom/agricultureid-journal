interface JsonLdProps {
  /** One or more schema.org JSON-LD objects. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders schema.org JSON-LD. Content is our own structured data (never user
 * input), and JSON.stringify escapes it safely; we additionally guard against
 * a literal `</script>` sequence.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
