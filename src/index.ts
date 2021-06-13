import PriorityQueue from "priorityqueuejs";

export type NodeKey = string | number;

export interface Edge<T> {
  node: T;
  weight: number;
}

interface QueueEntry<T> {
  node: T;
  cost: number;
}

export interface IGraphAdapter<T> {
  getKey?: (node: T) => NodeKey;
  getEdges: (node: T) => Edge<T>[];
}

const getNodeKey = <T>(node: T, adapter: IGraphAdapter<T>): NodeKey => {
  if (typeof adapter.getKey === "function") return adapter.getKey(node);
  if (typeof node === "string" || typeof node === "number") return node;
  throw new Error("Adapter must implement method getKey");
};

export const dijkstra = <T>(
  adapter: IGraphAdapter<T>,
  startNode: T,
  finishNode?: T
) => {
  const getKey = (node: T) => getNodeKey(node, adapter);
  const parents: Record<NodeKey, T> = Object.create(null);
  const costs: Record<NodeKey, number> = Object.create(null);
  const explored: Record<NodeKey, boolean> = Object.create(null);
  const prioQueue = new PriorityQueue<QueueEntry<T>>((a, b) => b.cost - a.cost);
  prioQueue.enq({ node: startNode, cost: 0 });

  do {
    let node = prioQueue.deq().node;
    let nodeKey = getKey(node);
    let cost = costs[nodeKey] || 0;

    explored[nodeKey] = true;

    // Early return when the shortest path in our
    // graph is already the finishNode
    if (undefined !== finishNode && nodeKey === getKey(finishNode)) break;

    const edges = adapter.getEdges(node);
    for (let i = 0; i < edges.length; i++) {
      const childNode = edges[i].node;
      const childNodeKey = getKey(childNode);
      let alt = cost + edges[i].weight;

      if (undefined === costs[childNodeKey] || alt < costs[childNodeKey]) {
        costs[childNodeKey] = alt;
        parents[childNodeKey] = node;

        if (!explored[childNodeKey]) {
          prioQueue.enq({ node: childNode, cost: alt });
        }
      }
    }
  } while (!prioQueue.isEmpty());

  return {
    costs,
    parents,
  };
};

export const findShortestPath = <T>(
  adapter: IGraphAdapter<T>,
  startNode: T,
  finishNode: T
) => {
  const getKey = (node: T) => getNodeKey(node, adapter);
  const { costs, parents } = dijkstra(adapter, startNode, finishNode);

  let optimalPath = [finishNode];
  let parent = parents[getKey(finishNode)];
  while (parent) {
    optimalPath.push(parent);
    parent = parents[getKey(parent)];
  }
  optimalPath.reverse();

  const results = {
    distance: costs[getKey(finishNode)],
    path: optimalPath,
  };

  return results;
};
