import { NodeType } from '../types';

// A* algorithm implementation based on this
// Theory
// https://theory.stanford.edu/~amitp/GameProgramming/ImplementationNotes.html
// Pseudocode
// https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2
export function aStar(grid: NodeType[][], startNode: NodeType, endNode: NodeType): NodeType[] {
    const openSet: NodeType[] = []; // possible solution paths
    const closedSet: NodeType[] = []; // solved path
    
    startNode.g = 0;  // g is the cost from start to current node
    startNode.f = heuristic(startNode, endNode);  // f = g + h, where h is the heuristic (estimated cost to end)
    openSet.push(startNode);

    while (openSet.length > 0) {
        // find node with lowest f score in the open set
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f! < openSet[lowestIndex].f!) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];

        if (current === endNode) {
            return closedSet;
        }

        // move current node from open set to closed set
        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        // check all neighbors of current node
        let neighbors = getNeighbors(grid, current);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            // skip neighbor if it's in the closed set or is a wall
            if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                let tempG = (current.g || 0) + 1;  // temporary g score

                let newPath = false;
                if (openSet.includes(neighbor)) {
                    // if this path to neighbor is better(smaller) than any previous one, record it
                    if (tempG < (neighbor.g || 0)) {
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    // update the neighbor's score and parent
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g! + neighbor.h;
                    neighbor.previousNode = current;
                }
            }
        }
    }

    // case where there's no path to the end node
    return closedSet;
}

function getNeighbors(grid: NodeType[][], node: NodeType): NodeType[] {
    const neighbors: NodeType[] = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors;
}

// heuristic - estimates the cost from node a to node b (Manhattan distance)
function heuristic(a: NodeType, b: NodeType): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}