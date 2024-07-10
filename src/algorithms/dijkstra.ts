// algorithms/dijkstra.ts
import { NodeType } from '../types';

export function dijkstra(grid: NodeType[][], startNode: NodeType, endNode: NodeType): NodeType[] {
    const visitedNodesInOrder: NodeType[] = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift()!;
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === endNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes: NodeType[]): void {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: NodeType, grid: NodeType[][]): void {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node: NodeType, grid: NodeType[][]): NodeType[] {
    const neighbors: NodeType[] = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid: NodeType[][]): NodeType[] {
    const nodes: NodeType[] = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}