import { Edge, IGraphAdapter, NodeKey } from "../../src";

export class MyEdgeImpl {
  node: MyNodeImpl;
  cost: number;

  constructor(node: MyNodeImpl, cost: number) {
    this.node = node;
    this.cost = cost;
  }
}

export class MyNodeImpl {
  name: string;
  edges: MyEdgeImpl[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addEdge(node: MyNodeImpl, cost: number) {
    this.edges.push(new MyEdgeImpl(node, cost));
  }
}

export class GraphAdapter implements IGraphAdapter<MyNodeImpl> {
  getKey(n: MyNodeImpl): NodeKey {
    return n.name;
  }

  getEdges(n: MyNodeImpl): Edge<MyNodeImpl>[] {
    return n.edges.map(({ node, cost }) => ({ node, weight: cost }));
  }
}

export const startNode = new MyNodeImpl("start");
export const nodeA = new MyNodeImpl("A");
export const nodeB = new MyNodeImpl("B");
export const nodeC = new MyNodeImpl("C");
export const nodeD = new MyNodeImpl("D");
export const finishNode = new MyNodeImpl("finish");

startNode.addEdge(nodeA, 5);
startNode.addEdge(nodeB, 2);
nodeA.addEdge(nodeC, 4);
nodeA.addEdge(nodeD, 2);
nodeB.addEdge(nodeA, 8);
nodeB.addEdge(nodeD, 7);
nodeC.addEdge(nodeD, 6);
nodeC.addEdge(finishNode, 3);
nodeD.addEdge(finishNode, 1);

/**
 * const result = findShortestPath(
 *   new GraphAdapter(),
 *   startNode,
 *   finishNode
 * );
 *
 * // {
 * //   distance: 8,
 * //   path: [
 * //     Node { edges: [Array], name: 'start' },
 * //     Node { edges: [Array], name: 'A' },
 * //     Node { edges: [Array], name: 'D' },
 * //     Node { edges: [], name: 'finish' }
 * //   ]
 * // }
 * console.log(result);
 */
