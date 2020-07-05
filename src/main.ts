const gcd = (a: bigint, b: bigint) => (b === 0n ? a : gcd(b, a % b));

class Rational {
  x: bigint;
  y: bigint;
  constructor(x: bigint, y: bigint = 1n) {
    let g = gcd(x, y);
    this.x = x / g;
    this.y = y / g;
    if (this.y < 0n) {
      this.x *= -1n;
      this.y *= -1n;
    }
  }

  isNonZero = () => this.x !== 0n;

  isZero = () => this.x === 0n;

  add(other: Rational): Rational {
    let yResult = this.y * other.y,
      xResult = this.x * other.y + other.x * this.y;
    return new Rational(xResult, yResult);
  }

  multiple(multiplier: bigint | Rational): Rational {
    if (multiplier instanceof Rational) {
      return new Rational(this.x * multiplier.x, this.y * multiplier.y);
    }
    return new Rational(this.x * multiplier, this.y);
  }

  divide(divisor: Rational | bigint): Rational | never {
    if (divisor instanceof Rational) {
      if (!divisor.isNonZero) throw new Error('Division by zero');
      return new Rational(this.x * divisor.y, this.y * divisor.x);
    }
    if (!divisor) throw new Error('Division by zero');
    return new Rational(this.x, this.y * divisor);
  }

  copy = () => new Rational(this.x, this.y);

  toString = () => (this.y === 1n ? '' + this.x : `${this.x}/${this.y}`);
}

class Matrix {
  matrix: Rational[][];
  nrow: number;
  ncol: number;
  n: number;
  constructor(matrix: Rational[][]) {
    this.matrix = matrix;
    this.nrow = matrix.length;
    this.ncol = matrix[0].length;
    this.n = this.ncol - 1;
  }

  column = (index: number) => this.matrix.map((row) => row[index]);

  row = (index: number) => this.matrix[index];

  isZeroColumn = (index: number, fromRow: number) =>
    this.column(index)
      .slice(fromRow)
      .every((e) => e.isZero());

  firstNonZeroEntryInColumn(col: number): number | never {
    for (let row = 0; row < this.nrow; row++) {
      if (this.matrix[row][col].isNonZero()) return row;
    }
    throw new Error('Not found any non-zero entry in column ' + col);
  }

  copyRow = (rowIndex: number) =>
    this.row(rowIndex).map((e) => new Rational(e.x, e.y));

  swapRow(rowIndex1: number, rowIndex2: number): void {
    let tempRow1 = this.copyRow(rowIndex1),
      tempRow2 = this.copyRow(rowIndex2);
    this.matrix[rowIndex1] = tempRow2;
    this.matrix[rowIndex2] = tempRow1;
  }

  toEchelonForm(): void {
    let topRow = 0,
      leftCol = 0;
    while (leftCol < this.ncol && topRow < this.nrow) {
      // find first non-zero column
      if (this.isZeroColumn(leftCol, topRow)) {
        leftCol++;
        continue;
      }

      // find first non-entry in column colPivot
      let rowPivot = topRow,
        colPivot = leftCol;
      for (; rowPivot < this.nrow; rowPivot++) {
        if (this.matrix[rowPivot][colPivot].isNonZero()) break;
      }
      if (rowPivot === this.nrow) break;

      // swap two rows if necessary
      if (rowPivot !== topRow) {
        this.swapRow(topRow, rowPivot);
        rowPivot = topRow;
      }

      // make pivot to 1
      let pivotCopy = this.matrix[rowPivot][colPivot].copy();
      for (let j = colPivot; j < this.ncol; j++)
        this.matrix[rowPivot][j] = this.matrix[rowPivot][j].divide(pivotCopy);

      // make all entries belove pivot to zero
      for (let i = rowPivot + 1; i < this.nrow; i++) {
        let c = this.matrix[i][colPivot].multiple(-1n);
        for (let j = colPivot; j < this.ncol; j++) {
          this.matrix[i][j] = this.matrix[i][j].add(
            c.multiple(this.matrix[rowPivot][j]),
          );
        }
      }

      leftCol++;
      topRow++;
    }
  }

  toReduceEchelonForm(): void {
    let bottomRow = this.nrow - 1,
      rightCol = this.ncol - 1;
    this.print();
    while (bottomRow >= 0 && rightCol >= 0) {
      // find lowest pivot
      if (this.row(bottomRow).every((entry) => entry.isNonZero() === false)) {
        bottomRow--;
        continue;
      }

      let rowPivot = bottomRow,
        colPivot = 0;
      for (; colPivot <= rightCol; colPivot++) {
        if (this.matrix[rowPivot][colPivot].isNonZero()) break;
      }

      if (colPivot === this.ncol) break;

      for (let i = rowPivot - 1; i >= 0; i--) {
        let c = new Rational(-1n).multiple(this.matrix[i][colPivot]);
        for (let j = colPivot; j < this.ncol; j++)
          this.matrix[i][j] = this.matrix[i][j].add(
            c.multiple(this.matrix[rowPivot][j]),
          );
      }

      bottomRow--;
      rightCol = colPivot - 1;
    }
  }

  rank(rightCol: number) {
    let r = 0;
    for (; r < this.nrow; r++) {
      let row = [...Array(rightCol)].map((_, i) => this.matrix[r][i]);
      if (row.every((entry) => !entry.isNonZero())) break;
    }
    return r;
  }

  pivotColumns(): number[] {
    let result: number[] = [];
    for (let i = 0; i < this.nrow; i++) {
      for (let j = 0; j < this.ncol; j++) {
        if (this.matrix[i][j].isNonZero()) {
          result.push(j);
          break;
        }
      }
    }
    return result;
  }

  nonPivotColumns(): number[] {
    let result: number[] = [],
      pivotColumns = this.pivotColumns();
    for (let i = 0; i < this.ncol - 1; i++) {
      if (pivotColumns.indexOf(i) === -1) result.push(i);
    }
    return result;
  }

  solve() {
    this.toEchelonForm();
    this.toReduceEchelonForm();
    let ra = this.rank(this.ncol - 1),
      rb = this.rank(this.ncol),
      pivotColumns = this.pivotColumns(),
      nonPivotColumns = this.nonPivotColumns();
    if (ra !== rb) return 'SOL=NONE';
    if (ra === this.n) {
      return (
        'SOL=(' +
        this.column(this.ncol - 1)
          .slice(0, this.n)
          .map((entry) => entry.toString())
          .join('; ') +
        ')'
      );
    }

    let result = '',
      coef: Rational[][] = [];
    for (let x = 0; x < this.n; x++) {
      let isPivot = pivotColumns.indexOf(x) > -1;
      let row: Rational[] = [];
      if (!isPivot) {
        row.push(new Rational(0n));
        row.push(
          ...nonPivotColumns.map((e) => new Rational(e === x ? 1n : 0n)),
        );
        coef.push(row);
      } else {
        let r = pivotColumns.indexOf(x);
        row.push(this.matrix[r][this.ncol - 1]);
        row.push(
          ...nonPivotColumns.map((e) => this.matrix[r][e].multiple(-1n)),
        );
        coef.push(row);
      }
    }

    for (let q = 0; q < coef[0].length; q++) {
      let vector = '(' + coef.map((row) => row[q].toString()).join('; ') + ')';
      result += q === 0 ? vector : ` + q${q} * ${vector}`;
    }

    return 'SOL=' + result;
  }

  format: () => string = () =>
    this.matrix.map((row) => row.map((x) => x.toString()).join(' ')).join('\n');

  print: () => void = () => console.log(this.format());
}

function parseRational(str: string): Rational {
  let elements = str.split('/');
  if (elements.length === 1) return new Rational(BigInt(+elements[0]));
  return new Rational(BigInt(+elements[0]), BigInt(+elements[1]));
}

function parseSystem(input: string): Matrix {
  let equations = input.split('\n');
  return new Matrix(
    equations.map((equation) =>
      equation.split(' ').map((str) => parseRational(str)),
    ),
  );
}

const solve = (input) => parseSystem(input).solve();
