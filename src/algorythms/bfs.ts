// algorithms/bfs.ts
import { NodeType } from '../types';

export function bfs(grid: NodeType[][], startNode: NodeType, endNode: NodeType): NodeType[] {
    const visitedNodesInOrder: NodeType[] = [];
    const queue: NodeType[] = [];
    startNode.isVisited = true;
    queue.push(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift()!;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }
    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: NodeType, grid: NodeType[][]): NodeType[] {
    const neighbors: NodeType[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}