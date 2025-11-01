# Scrapegoat SDK

Goatspeak language:

COMMANDS:

- SCRAPE
  - Returns a list of HTML nodes matching the criteria.
  - Example: `SCRAPE 1 div;` returns the first `<div>` element within the current context.
- SELECT
  - Changes the context to the selected node. for subsequent commands. If multiple nodes are selected, the command is executed for each node.
  - Example: `SELECT 1 div;` changes the context to the first `<div>` element within the current context.

CONDITIONALS:

- IF
  - Logical statement involving the value of an attribute.
  - Example: `SCRAPE 1 div IF class="header";` returns the first `<div>` element with a class attribute of "header".
- IN
  - Positional statement involving where an element is relative to the DOM.
  - Example: `SCRAPE 3 li IN div;` returns the first three `<li>` element that is a child of a `<div>` element.

KEYWORDS:

- POSITION
  - Only available within IN conditionals. Specifies that the element must be the nth occurrence of that tag within the context.
  - Example: `SCRAPE 1 li IN POSITION=5;` returns the fifth `<li>` element within the current context.
- NOT
  - Negates a conditional.
  - Example: `SCRAPE 1 div NOT IF class="header";` returns the first `<div>` element that does not have a class attribute of "header".

NESTING:

- Commands can be nested to create more complex queries.
- Example: `SELECT 1 div IF class="content"\nSCRAPE p;` selects the first `<div>` with class "content", sets it as the new context for all subequent queries, then scrapes all `<p>` elements within that `<div>`.

RULES:

- I will make the langauge more flexible later. Currently the following rules apply:
  - Each string is a single command.
  - Each command must end with a semicolon (`;`).
  - Commands can have multiple IF conditionals, but only one IN conditional. Conditionals must come after the command, and are separated by spaces.
  - Complex queries must be separated by a newline character (`\n`).
  - Commands are executed in the order they are written, from top to bottom.
  - The NOT keyword must come before a conditional to apply to it.
  - If no number is specified after the command, it defaults to all matching elements.
  - Commands are case sensitive.

KNOWN BUGS:

- The value assigned in if conditional statements cannot contain spaces (e.g. `IF class="header main"` will not work).
