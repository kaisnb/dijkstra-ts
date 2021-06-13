import { dijkstra, Edge, findShortestPath, IGraphAdapter } from "../src";
import * as oGraph from "./graphs/object-graph";
import * as pGraph from "./graphs/primitive-graph";

describe("dijkstra", () => {
  const graphAdapter = new pGraph.GraphAdapter(pGraph.graph);

  const graphAdapterZeroWeight = new pGraph.GraphAdapter({
    [pGraph.startNode]: { A: 0, B: 2 },
    A: { [pGraph.finishNode]: 0 },
    B: { [pGraph.finishNode]: 2 },
    [pGraph.finishNode]: {},
  });

  class BrokenObjectGraphAdapter implements IGraphAdapter<oGraph.MyNodeImpl> {
    getEdges(n: oGraph.MyNodeImpl): Edge<oGraph.MyNodeImpl>[] {
      return n.edges.map(({ node, cost }) => ({ node, weight: cost }));
    }
  }

  it("should calculate all paths in an acyclic graph without negative edges", () => {
    const result = dijkstra(graphAdapter, pGraph.startNode);

    expect(result).toMatchSnapshot();
  });

  it("should early return when finishNode is found", () => {
    graphAdapter.getEdges = jest.spyOn(graphAdapter, "getEdges") as any;

    dijkstra(graphAdapter, pGraph.startNode, pGraph.finishNode);

    expect(graphAdapter.getEdges).toHaveBeenCalledTimes(4);
  });

  it("should use getKey when implemented", () => {
    const adapter = new oGraph.GraphAdapter();
    adapter.getKey = jest.spyOn(adapter, "getKey") as any;

    const result = dijkstra(adapter, oGraph.startNode);

    expect(result).toMatchSnapshot();
    expect(adapter.getKey).toBeCalledTimes(17);
  });

  it("should throw when getKey is not implemented", () => {
    expect(() =>
      dijkstra(new BrokenObjectGraphAdapter(), oGraph.startNode)
    ).toThrow("Adapter must implement method getKey");
  });

  describe("findShortestPath", () => {
    it("should return distance 8", () => {
      const result = findShortestPath(
        graphAdapter,
        pGraph.startNode,
        pGraph.finishNode
      );

      expect(result).toMatchSnapshot();
      expect(result.distance).toBe(8);
    });

    it("should return distance 0", () => {
      const result = findShortestPath(
        graphAdapterZeroWeight,
        pGraph.startNode,
        pGraph.finishNode
      );

      expect(result).toMatchSnapshot();
      expect(result.distance).toBe(0);
    });
  });
});
