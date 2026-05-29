<script lang="ts">
  /*
   * Don't mind the mess
   */
  import { DFA, JS, NFA, ENFA, Words } from "refa";

  import {
    Button,
    ButtonSet,
    Row,
    Column,
    TextInput,
  } from "carbon-components-svelte";
  // import IconChevronRight from "carbon-icons-svelte/lib/ChevronRight.svelte";
  import IconGears from "carbon-icons-svelte/lib/Gears.svelte";
  import IconReset from "carbon-icons-svelte/lib/Reset.svelte";
  import IconPlay from "carbon-icons-svelte/lib/Play.svelte";
  import IconInspect from "carbon-icons-svelte/lib/ZoomFit.svelte";

  import {
    createDFA,
    type DFATransitionInstruction,
  } from "$lib/utils/automata/dfa";
  import {
    createPDA,
    type PDATransitionInstruction,
  } from "$lib/utils/automata/pda";
  import { createCfg } from "$lib/utils/automata/cfg";
  import {
    default as MarkdownRender,
    enableMermaid,
    enableKatex,
  } from "markstream-svelte";
  import { lexString, parse } from "$lib/cfg";

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

  let rawRegex = $state("(aa+bb)(a+b)*");
  let regularExpression = $state(rawRegex);
  const alphabet = $derived(
    regularExpression
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("+", "")
      .replaceAll("*", ""),
  );

  let rawQuery = $state("");
  let query = $state(rawQuery);

  const regex = $derived(new RegExp(regularExpression.replaceAll("+", "|")));

  const dfa = $derived(toDFA(regex));
  const dfaMap = $derived(createDFA.map(dfa));

  const dfaOutput = $derived(createDFA.toMermaid(dfa, dfaMap));
  const pdaOutput = $derived(
    createPDA.toMermaid(dfa, createDFA.map(dfa), {
      characters: {
        push: "a",
        pop: "b",
      },
    }),
  );

  const dfaAnimator = $derived(createDFA.toAnimationStack(dfa.initial, dfaMap));
  const pdaAnimator = $derived(
    createPDA.toAnimationStack(dfa.initial, dfaMap, {
      characters: {
        push: alphabet[0],
        pop: alphabet[1],
      },
    }),
  );

  let dfaTransitionStack: DFATransitionInstruction[] = $state([]);
  let pdaTransitionStack: PDATransitionInstruction[] = $state([]);

  let dfaTransition = $state("");
  let pdaTransition = $state("");

  const dfaMd = $derived(`
\`\`\`mermaid
flowchart LR
${dfaOutput}

%% Transition
${dfaTransition}
\`\`\`
`);

  const pdaMd = $derived(`
\`\`\`mermaid
flowchart LR
${pdaOutput}

%% Transition
${pdaTransition}
\`\`\`
`);

  const cfg = $derived(`
\`\`\`cfg
${createCfg.fromAst(parse(lexString(regularExpression)))}
\`\`\`
  `);

  enableMermaid();
  enableKatex();
</script>

<Column>
  <Row>
    <TextInput
      bind:value={rawRegex}
      labelText="Regular Expression"
      placeholder="Example: (aa+bb)(a+b)*"
    />
    <Button
      icon={IconInspect}
      iconDescription="Parse"
      tooltipPosition="left"
      on:click={() => {
        regularExpression = rawRegex;
      }}
    />
  </Row>
  <Row>
    <TextInput
      bind:value={rawQuery}
      labelText="Query"
      placeholder="Example: bbaba"
    />
    <Button
      icon={IconGears}
      iconDescription="Test"
      tooltipPosition="left"
      on:click={() => {
        if (dfa.test(Words.fromStringToUnicode(rawQuery)) === false) {
          return alert("INVALID QUERY");
        }

        query = rawQuery;
      }}
    />
  </Row>

  <Row>
    <div aria-hidden="true" class="h-6"></div>
  </Row>

  <Row class="bg-violet-100 rounded-lg">
    <MarkdownRender content={cfg} className="w-full" />
  </Row>

  <Row>
    <Column>
      <div class="relative">
        <MarkdownRender
          content={dfaMd}
          className="h-full"
          mermaidProps={{
            showCollapseButton: true,
            showCopyButton: false,
            showExportButton: false,
          }}
        />

        <ButtonSet class="absolute bottom-8 right-26">
          <Button
            on:click={() => {
              if (dfaTransitionStack.length <= 0) return;
              const item = dfaTransitionStack.pop()?.createTransition();
              if (dfaTransitionStack.length <= 0) alert("Animation finished");
              item ? (dfaTransition = item) : null;
            }}
            icon={IconPlay}
            iconDescription="Step"
            tooltipPosition="top"
          />
          <Button
            on:click={() => {
              if (query.length <= 0) {
                return alert("Blank query.");
              }

              dfaTransitionStack = dfaAnimator(query).toReversed();
              dfaTransition =
                dfaTransitionStack.pop()?.createTransition() ?? "";
            }}
            icon={IconReset}
            kind="danger"
            iconDescription="Reset"
            tooltipPosition="top"
          />
        </ButtonSet>
      </div>
    </Column>
    <Column>
      <div class="relative">
        <MarkdownRender
          content={pdaMd}
          className="h-full"
          mermaidProps={{
            showCollapseButton: true,
            showCopyButton: false,
            showExportButton: false,
          }}
        />

        <!-- <ButtonSet class="absolute bottom-8 right-26">
          <Button
            on:click={() => {
              if (pdaTransitionStack.length <= 0) return;
              const item = pdaTransitionStack.pop()?.createTransition();
              if (pdaTransitionStack.length <= 0) alert("Animation finished");
              item ? (pdaTransition = item) : null;
            }}
            icon={IconPlay}
            iconDescription="Step"
            tooltipPosition="top"
          />
          <Button
            on:click={() => {
              if (query.length <= 0) {
                return alert("Blank query.");
              }

              pdaTransitionStack = pdaAnimator(query).toReversed();
              pdaTransition =
                pdaTransitionStack.pop()?.createTransition() ?? "";
            }}
            icon={IconReset}
            kind="danger"
            iconDescription="Reset"
            tooltipPosition="top"
          />
        </ButtonSet> -->
      </div>
    </Column>
  </Row>
</Column>
