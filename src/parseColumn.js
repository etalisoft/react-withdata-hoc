import { isBool, isNum, toArray } from './helpers';

export default (value, curColumns, rawColumns) => {
  return !rawColumns
    ? undefined
    : rawColumns.map((rawCol, index) => {
        const { id } = rawCol;
        const newCol = value && value.find(c => c.column === id);
        const curCol = curColumns && curColumns.find(c => c.column === id);
        return {
          ...rawCol,
          visible:
            newCol && isBool(newCol.visible)
              ? newCol.visible
              : curCol && isBool(curCol.visible) ? curCol.visible : isBool(rawCol.visible) ? rawCol.visible : true,
          priority:
            newCol && isNum(newCol.priority)
              ? newCol.priority
              : curCol && isNum(curCol.priority) ? curCol.priority : isNum(rawCol.priority) ? rawCol.priority : index,
        };
      });
};
