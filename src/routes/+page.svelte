<script lang="ts">
  import { Mermaid } from "@friendofsvelte/mermaid";
  import type { MermaidConfig } from "@friendofsvelte/mermaid";
  import { DFA, FiniteAutomaton, JS, NFA, ENFA, Words } from "refa";

  function toENFA(regex: RegExp): ENFA {
    const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();
    return ENFA.fromRegex(expression, { maxCharacter });
  }

  function toNFA(regex: RegExp): NFA {
    const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();
    return NFA.fromRegex(expression, { maxCharacter });
  }

  function toDFA(regex: RegExp): DFA {
    return DFA.fromFA(toNFA(regex));
  }

  const regstr = "(aabb)(a|b)*";
  const regex = /(aa|bb)(a|b)*/;

  const enfa = toENFA(regex);
  const nfa = toNFA(regex);
  const dfa = toDFA(regex);

  const config: MermaidConfig = {
    theme: "dark",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
  };

  console.log("banana");
  $effect(() => console.error(dfa.toMermaid()));

  // `style n0 fill:#f00,color:white,font-weight:bold,stroke-width:2px,stroke:yellow`

  // (aa+bb)(a+b)*
  const invalidDiagram = `
  ${dfa.toMermaid()}

  style n0 fill:#f00,color:white,font-weight:bold,stroke-width:2px,stroke:yellow
  `;
</script>

<Mermaid class="select-none" string={invalidDiagram} {config}>
  {#snippet error(errorObj)}
    <div class="error-message">
      <p>Failed to render diagram: {errorObj.message}</p>
    </div>
  {/snippet}
</Mermaid>
