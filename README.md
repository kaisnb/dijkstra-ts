# Dijkstra TypeScript

A simple implementation of Dijkstra's algorithm using the Priority queue implementation [priorityqueue.js](https://github.com/janogonzalez/priorityqueuejs). Using a Priority queue we can achieve a runtime complexity of `O(E*log V)` where `E` is the total number of edges and `V` is the number vertices(called nodes in this package). More about the runtime complexity can be found on [Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Running_time).

## Installation

```
npm install https://github.com/kaisnb/dijkstra-ts.git
```

## Example

The implementation makes no assumption about the datastructure you use to store your graph. To use the algorithm we just need to create an adapter that implements the `IGraphAdapter<T>` interface. To implement this interface we just need to implement the method `getEdges(n: T): Edge<T>[]`. `T` can be an object type or a primitive type. In case it's an object type we also have to implement the `getKey(n: T): NodeKey` method to map our nodes to unique keys.

```typescript
import { Edge, findShortestPath, IGraphAdapter } from "dijkstra-ts";

export type GraphType = Record<string, Record<string, number>>;

export class GraphAdapter implements IGraphAdapter<string> {
  graph: GraphType;

  constructor(graph: GraphType) {
    this.graph = graph;
  }

  getEdges(n: string): Edge<string>[] {
    return Object.entries(this.graph[n]).map(([key, value]) => ({
      node: key,
      weight: value,
    }));
  }
}

export const startNode = "start";
export const finishNode = "finish";
export const graph: GraphType = {
  [startNode]: { A: 5, B: 2 },
  A: { C: 4, D: 2 },
  B: { A: 8, D: 7 },
  C: { D: 6, [finishNode]: 3 },
  D: { [finishNode]: 1 },
  [finishNode]: {},
};

const result = findShortestPath(new GraphAdapter(graph), startNode, finishNode);

console.log(result); // { distance: 8, path: [ 'start', 'A', 'D', 'finish' ] }
```

Or to obtain a map of the costs of all paths and all the calculated parent nodes, call `dijkstra<T>(adapter: IGraphAdapter<T>, startNode: T, finishNode?: T)` instead. It's optional to pass the `finishNode`. In case the `finishNode` is passed (like it's done indirectly when called via `findShortestPath`) the resulting cost and parent maps can be uncomplete because an optimization takes place and the algorithm returns as early as the shortest path to the `finishNode` is found.

For more usage examples see the test `test/dijkstra.test.ts` and the example adapters under `test/graphs`.

## License

Everything in this repository is [licensed under the MIT License](https://github.com/kaisnb/dijkstra-ts/blob/master/LICENSE) unless otherwise specified.

Copyright (c) 2021 Kai Schönberger
