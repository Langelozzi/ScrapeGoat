export function buildQuery({
  action = "SCRAPE",
  amount = "1",
  tag,
  conditionals = [],
  flags = [],
}) {
  if (!tag) throw new Error("Missing tag for query builder");

  let query = `${action} ${amount} ${tag}`;

  // Build conditional section
  if (conditionals.length > 0) {
    const parts = conditionals.map(c => {
      if (c.type === "IF") return `IF ${c.key}="${c.value}"`;
      if (c.type === "NOT IF") return `NOT IF ${c.key}="${c.value}"`;
      if (c.type === "IN") return `IN ${c.key}`;
      if (c.type === "NOT IN") return `NOT IN ${c.key}`;
      if (c.type === "POSITION") return `IN POSITION=${c.value}`;
      return "";
    });

    query += " " + parts.join(", ");
  }

  // Flags
  if (flags.length > 0) {
    const f = flags.map(fl => `--${fl}`).join(" ");
    query += " " + f;
  }

  return query + ";";
}
