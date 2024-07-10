import React, { useState, useEffect, useCallback } from 'react';
import { NodeType } from './types';
import { Node } from './Node';
import { aStar, dijkstra, bfs } from './algorithms';
import './App.css';
import { dfs } from './algorithms/dfs';

const App: React.FC = () => {
  const rows = 20;
  const cols = 25;

  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({ row: 10, col: 4 });
  const [endNode, setEndNode] = useState<{ row: number; col: number }>({ row: 10, col: 20 });
  const [isRunning, setIsRunning] = useState(false);

  const createNode = (row: number, col: number): NodeType => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isEnd: row === endNode.row && col === endNode.col,
      isWall: false,
      distance: Infinity,
      isVisited: false,
      previousNode: null,
    };
  };

  // Mouse Logic Handlers
  const handleMouseDown = (row: number, col: number): void => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number): void => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (): void => {
    setMouseIsPressed(false);
  };

  // Grid Logic
  const getInitialGrid = useCallback((): NodeType[][] => {
    const initialGrid: NodeType[][] = [];
    for (let row = 0; row < rows; row++) {
      const currentRow: NodeType[] = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  }, []);

  const getNewGridWithWallToggled = (grid: NodeType[][], row: number, col: number): NodeType[][] => {
    const newGrid = grid.map(row => row.slice());
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const resetGrid = useCallback(() => {
    const newGrid = getInitialGrid();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const node = newGrid[row][col];
        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if (nodeElement) {
          nodeElement.className = 'node';
          if (node.isStart) {
            nodeElement.className = 'node node-start';
          } else if (node.isEnd) {
            nodeElement.className = 'node node-end';
          }
        }
      }
    }
    setGrid(newGrid);
  }, [getInitialGrid]);

  // Algorithm Logic - Run / Animate /
  const visualizeAlgorithm = (algorithm: string): void => {
    if (isRunning) return;
    setIsRunning(true);
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    let visitedNodesInOrder: NodeType[];

    switch (algorithm) {
      case 'aStar':
        visitedNodesInOrder = aStar(grid, startNodeObj, endNodeObj);
        break;
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNodeObj, endNodeObj);
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNodeObj, endNodeObj);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNodeObj, endNodeObj);
        break;
      default:
        return;
    }

    animateAlgorithm(visitedNodesInOrder);
    setIsRunning(false);
  };

  const animateAlgorithm = (visitedNodesInOrder: NodeType[]): void => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(getNodesInShortestPathOrder(grid[endNode.row][endNode.col]));
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = 'node node-visited';
        }
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: NodeType[]): void => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  };

  const getNodesInShortestPathOrder = (endNode: NodeType): NodeType[] => {
    const nodesInShortestPathOrder: NodeType[] = [];
    let currentNode: NodeType | null = endNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  useEffect(() => {
    setGrid(getInitialGrid());
  }, [getInitialGrid]);

  return (
    <div className="app">
      <h1> React Pathfinding Algorithm Visualizer</h1>
      <div className="buttonsContainer">
        <button onClick={() => visualizeAlgorithm('aStar')}>Visualize A*</button>
        <button onClick={() => visualizeAlgorithm('dijkstra')}>Visualize Dijkstra</button>
        <button onClick={() => visualizeAlgorithm('bfs')}>Visualize BFS</button>
        <button onClick={() => visualizeAlgorithm('dfs')}>Visualize DFS</button>
        <button onClick={resetGrid} disabled={isRunning}>Reset Grid</button>
      </div>

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isStart, isEnd, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    isStart={isStart}
                    isEnd={isEnd}
                    isWall={isWall}
                    onMouseDown={() => handleMouseDown(row, col)}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}
                    col={col}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;