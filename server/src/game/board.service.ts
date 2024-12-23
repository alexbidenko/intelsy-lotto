import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class BoardService {
  private shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  generate(): (number | null)[][] {
    const BOARD_COUNT = 1;
    const ROWS = 3;
    const COLS = 9;

    const columnRanges = [
      [1, 9], // 1-й столбец: 9 чисел
      [10, 19], // 2-й столбец: 10 чисел
      [20, 29], // 3-й столбец: 10 чисел
      [30, 39], // 4-й столбец: 10 чисел
      [40, 49], // 5-й столбец: 10 чисел
      [50, 59], // 6-й столбец: 10 чисел
      [60, 69], // 7-й столбец: 10 чисел
      [70, 79], // 8-й столбец: 10 чисел
      [80, 90], // 9-й столбец: 11 чисел
    ];

    const columnsNumbers = columnRanges.map(([start, end]) => {
      const nums = [];
      for (let n = start; n <= end; n++) {
        nums.push(n);
      }
      return nums;
    });

    // Функция для нахождения распределения (сколько чисел в каждом столбце для каждой из 6 карт)
    const findDistribution = (total: number): number[] => {
      let twosNeeded: number;
      if (total === 9) {
        twosNeeded = 3;
      } else if (total === 10) {
        twosNeeded = 4;
      } else if (total === 11) {
        twosNeeded = 5;
      } else {
        throw new Error('Unexpected total for distribution');
      }
      const arr = new Array(6).fill(1);
      for (let i = 0; i < twosNeeded; i++) {
        arr[i] = 2;
      }
      return this.shuffleArray(arr);
    };

    const tryGenerate = (): (number | null)[][][] | null => {
      // Перемешаем числа в каждом столбце
      for (let i = 0; i < COLS; i++) {
        columnsNumbers[i] = this.shuffleArray(columnsNumbers[i]);
      }

      // Найдём распределения для каждого столбца
      const distributions = columnRanges.map((range) =>
        findDistribution(range[1] - range[0] + 1),
      );

      const boardsColsNums: number[][][] = Array.from(
        { length: BOARD_COUNT },
        () => Array.from({ length: COLS }, () => []),
      );

      for (let col = 0; col < COLS; col++) {
        let startIndex = 0;
        for (let b = 0; b < BOARD_COUNT; b++) {
          const count = distributions[col][b];
          const colNums = columnsNumbers[col].slice(
            startIndex,
            startIndex + count,
          );
          startIndex += count;
          boardsColsNums[b][col] = colNums;
        }
      }

      // Проверка что в каждой карте ровно 15 чисел
      for (let b = 0; b < BOARD_COUNT; b++) {
        const totalNumbers = boardsColsNums[b].reduce(
          (acc, arr) => acc + arr.length,
          0,
        );
        if (totalNumbers !== 15) {
          // Если вдруг не 15, что маловероятно, вернём null для повторной попытки
          return null;
        }
      }

      // Попытаемся расставить числа для каждой карты по строкам с помощью бэктрекинга.

      const arrangeBoard = (
        columnsData: number[][],
      ): (number | null)[][] | null => {
        const result: (number | null)[][] = Array.from({ length: ROWS }, () =>
          Array(COLS).fill(null),
        );
        const rowCounts = [0, 0, 0];

        // Рекурсивная функция для расстановки столбцов
        const placeColumn = (colIndex: number): boolean => {
          if (colIndex === COLS) {
            // Проверим, что каждая строка имеет ровно 5 чисел
            return rowCounts.every((c) => c === 5);
          }

          const nums = columnsData[colIndex];
          if (nums.length === 0) {
            // Пустой столбец (теоретически не должен быть), просто пропустим
            return placeColumn(colIndex + 1);
          }

          if (nums.length === 1) {
            // Один номер - попробуем поставить в любую строку, где есть место
            for (let r = 0; r < ROWS; r++) {
              if (rowCounts[r] < 5 && result[r][colIndex] === null) {
                result[r][colIndex] = nums[0];
                rowCounts[r] += 1;
                if (placeColumn(colIndex + 1)) return true;
                // Откат
                result[r][colIndex] = null;
                rowCounts[r] -= 1;
              }
            }
          } else if (nums.length === 2) {
            // Два номера - нужно выбрать две разные строки
            for (let r1 = 0; r1 < ROWS; r1++) {
              for (let r2 = r1 + 1; r2 < ROWS; r2++) {
                if (
                  rowCounts[r1] < 5 &&
                  rowCounts[r2] < 5 &&
                  result[r1][colIndex] === null &&
                  result[r2][colIndex] === null
                ) {
                  result[r1][colIndex] = nums[0];
                  result[r2][colIndex] = nums[1];
                  rowCounts[r1] += 1;
                  rowCounts[r2] += 1;
                  if (placeColumn(colIndex + 1)) return true;
                  // Откат
                  result[r1][colIndex] = null;
                  result[r2][colIndex] = null;
                  rowCounts[r1] -= 1;
                  rowCounts[r2] -= 1;
                }
              }
            }
          }

          return false;
        };

        return placeColumn(0) ? result : null;
      };

      const boards: (number | null)[][][] = [];
      for (let b = 0; b < BOARD_COUNT; b++) {
        const board = arrangeBoard(boardsColsNums[b]);
        if (!board) {
          return null; // Если для хотя бы одной карты не получилось расставить - неудача
        }
        boards.push(board);
      }

      return boards;
    };

    // Поскольку генерация основана на рандоме, в редких случаях может не получиться с первого раза.
    // Повторим несколько попыток.
    for (let attempt = 0; attempt < 10000; attempt++) {
      const result = tryGenerate();
      if (result) return result[0];
    }

    throw new InternalServerErrorException(
      'Unable to generate a valid set of boards after multiple attempts.',
    );
  }
}
