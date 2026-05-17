import { TransitionIterable, FAIterator } from "refa";
import type { CharSet } from "refa";

/**
 * Traverses all reachable states of a given finite automaton (FA) starting
 * from its initial state. A Breadth-First Search (BFS) is used to ensure
 * each state is visited exactly once.
 *
 * @param fa - The finite automaton instance (e.g., DFA, NFA, ENFA).
 *              Must conform to the `TransitionIterable` interface.
 * @param callback - A user-defined function that will be called for each
 *                   visited state. The function receives the state object and,
 *                   optionally, the iterator object itself.
 */
function traverse<S>(
  fa: TransitionIterable<Map<S, any>>,
  callback: (state: S, iterator: FAIterator<Map<S, CharSet>>) => void,
): void {
  const iterator = fa.transitionIterator();
  const visited = new Set<S>();
  // Use a queue data structure for BFS. An array used as a queue
  // is sufficient for small- to medium-sized automata.
  const queue: S[] = [];

  // Start the traversal from the initial state
  visited.add(iterator.initial);
  queue.push(iterator.initial);

  while (queue.length > 0) {
    // Type assertion is safe because we only push defined states
    const currentState = queue.shift()!;

    // Apply the user's callback to the current state
    callback(currentState, iterator);

    // Explore all outgoing transitions from the current state
    const outgoingTransitions = iterator.getOut(currentState);

    // outgoingTransitions is a Map where each key is a target state.
    for (const targetState of outgoingTransitions.keys()) {
      if (!visited.has(targetState)) {
        visited.add(targetState);
        queue.push(targetState);
      }
    }
  }
}
