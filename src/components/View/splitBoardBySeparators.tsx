import type { WebBuilderElements } from 'types';

const splitBoardBySeparators = (boardByColumns: Array<WebBuilderElements>, columns: number): Array<[number, number]> => {
  const tmp: number[] = [];
  const lines: Array<[number, number]> = [];

  const appendTmp = () => {
    if (!tmp.length) return;

    const from = tmp[0];
    const to = tmp[tmp.length - 1];
    tmp.length = 0;
    lines.push([from, to]);
  };

  for (let i = 0; i < columns; i++) {
    const row = boardByColumns[i];
    if (row) {
      const hasSeparator = row.some((element) => element.componentName === 'Separator');
      if (hasSeparator) {
        appendTmp();
        continue;
      }
    }

    tmp.push(i);
  }

  appendTmp();

  return lines;
};

export default splitBoardBySeparators;
