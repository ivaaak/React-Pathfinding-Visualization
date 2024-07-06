// types.ts
export interface NodeType {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  distance: number;
  isVisited: boolean;
  previousNode: NodeType | null;
  f?: number;
  g?: number;
  h?: number;
}

export interface GridProps {
  grid: NodeType[][];
  mouseIsPressed: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export interface NodeProps {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
  row: number;
  col: number;
}