// algorithms/dfs.ts
import { NodeType } from '../types';

export function dfs(grid: NodeType[][], startNode: NodeType, endNode: NodeType): NodeType[] {
    const visitedNodesInOrder: NodeType[] = [];
    const stack: NodeType[] = [];
    stack.push(startNode);

    while (stack.length > 0) {
        const currentNode = stack.pop()!;

        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.previousNode = currentNode;
            stack.push(neighbor);
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