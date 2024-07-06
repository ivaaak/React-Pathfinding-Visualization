import { NodeProps } from "./types";

export const Node: React.FC<NodeProps> = ({ isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp, row, col }) => {
  const extraClassName = isStart
    ? 'node-start'
    : isEnd
      ? 'node-end'
      : isWall
        ? 'node-wall'
        : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    ></div>
  );
};
