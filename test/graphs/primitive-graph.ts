import { Edge, IGraphAdapter } from "../../src";

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

/**
 *
 * const result = findShortestPath(
 *   new GraphAdapter(graph),
 *   startNode,
 *   finishNode
 * );
 *
 * console.log(result); // { distance: 8, path: [ 'start', 'A', 'D', 'finish' ] }
 */
