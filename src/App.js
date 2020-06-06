import React, { useRef, useState } from "react";
import Graph from "react-graph-vis";
import NodeControl from "./NodeControl";
import EdgeControl from "./EdgeControl";
import SolveControl from "./SolveControl";
import DeleteControl from "./DeleteControl";
import { Container, Grid, Divider, Segment } from "semantic-ui-react";
import "./App.css";
import Header from "./components/Header";
import { MaxFlow } from "./util/maxFlow";
import { Dijkstra } from "./util/Dijkstra";

function App() {
  let graph = {
    nodes: [
      { id: "A", label: "A" },
      { id: "B", label: "B" },
      { id: "C", label: "C" },
      { id: "D", label: "D" },
      { id: "E", label: "E" },
    ],
    edges: [
      { from: "A", to: "B", label: "6" },
      { from: "A", to: "D", label: "1" },
      { from: "B", to: "D", label: "2" },
      { from: "B", to: "E", label: "1" },
      { from: "D", to: "E", label: "1" },
      { from: "E", to: "B", label: "2" },
      { from: "C", to: "B", label: "5" },
      { from: "E", to: "C", label: "5" },
    ],
  };
  const ref = useRef();

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
      smooth: true,
    },
    height: "100%",
  };

  return (
    <Container style={{ marginTop: "3em" }}>
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column width={6}>
            <Segment>
              <Header></Header>
              <Divider />
              <NodeControl onAdd={(node) => ref.current.nodes.add(node)} />
              <Divider />
              <DeleteControl
                onDelete={(id) => {
                  ref.current.nodes.remove({ id: id });
                }}
              />
              <Divider />
              <EdgeControl
                onAdd={(edge) => {
                  let old = null;
                  ref.current.edges.forEach((ed) => {
                    if (ed.from === edge.from && ed.to === edge.to) {
                      old = ed;
                    }
                  });
                  if (!old) {
                    ref.current.edges.add(edge);
                  } else {
                    ref.current.edges.remove(old);
                    ref.current.edges.add({ ...edge, color: "#7d5ab5" });
                  }
                }}
              ></EdgeControl>
              <Divider></Divider>
              <SolveControl
                onSolve={(s, e) => {
                  const [path, maxCap] = Dijkstra(
                    ref.current.nodes.get(),
                    ref.current.edges.get(),
                    s,
                    e
                  );
                  const strPath = path.join(">");

                  ref.current.nodes.forEach((node) => {
                    ref.current.nodes.update({
                      id: node.id,
                      label: node.id,
                      color: null,
                    });
                  });

                  path.forEach((nodeId) => {
                    ref.current.nodes.update({
                      id: nodeId,
                      label: nodeId,
                      color: "#5ab55e",
                    });
                  });

                  ref.current.edges.forEach((edge) => {
                    ref.current.edges.update({
                      ...edge,
                      color: null,
                      width: null,
                    });
                  });
                  ref.current.edges.forEach((edge) => {
                    if (strPath.includes(edge.from + ">" + edge.to))
                      ref.current.edges.update({
                        ...edge,
                        color: "#5ab55e",
                        width: 4,
                        title: "sss",
                      });
                  });
                  alert("Max Capacity : " + maxCap);
                }}
              ></SolveControl>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <Graph
                style={{ height: "500px", width: "100%" }}
                graph={graph}
                options={options}
                ref={ref}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
