/**
 * Student data and seating chart configuration for 404HR Math A
 *
 * Grid: 6 rows × 7 columns, given explicitly in SEAT_LAYOUT
 * (row 0 = front, next to the teacher's desk; null = no desk)
 *
 * Movement pattern (fixed 8-move cycle):
 *   1. Left 1, Forward 2
 *   2. Right 2
 *   3. Left 2, Forward 2
 *   4. Right 2
 *   5. Left 3, Forward 3
 *   6. Right 4
 *   7. Left 4, Back 2
 *   8. Right 4
 *
 * Wrapping: toroidal (modular arithmetic, goes around to the other side)
 * Empty seats: counted as grid positions for movement but skipped for calling
 */

// 出席番号 n の生徒は students[n - 1]。退学者は null にして番号はそのまま残す
export const students = [
  "天野 紗希", "岩澤 爾七", "岩舘 美桜", "大住 旬", "大八木 桃実",
  "大山 航平", "沖 愛佳", "小野 遥", "上條 優衣", "川原 愛生",
  "黒川 晃世", "郷地 翔大", "小島 朱莉", "小林 美海", "頃安 誠",
  "崔 紗会", "佐子 凜夏", "鈴木 僚太", "瀬戸 康太", "高橋 直太",
  "瀧澤 涼", "武田 頼景", "田中 譲太郎", "土蔵 創一", "中尾 結衣子",
  "中村 純羽", "橋本 かれん", "東 暖大", "平井 結芽", "福島 創士",
  "藤井 千夏", null /* 32: 退学（番号は詰めない） */, "壬生 周太郎", "宮田 花帆", "宮本 航希",
  "柳川 大河", "山崎 唯翔", "横山 蓉", "吉田 芽生"
];

export const ROWS = 6;
export const COLS = 7;

// Seating chart by student number (席替えしたらここを書き換える)
// row 0 = 教卓側（前）, null = 机なし
export const SEAT_LAYOUT = [
  [null,  5, 13, 33, 19, 26, null],
  [30,    1, 15, 28, 36, 14, 29],
  [35,   37, 22,  3, 34, 20, 10],
  [9,     2, 21, 16,  6,  4, 11],
  [27,   38, 23, 18, 12,  8, 25],
  [null, 31, 39,  7, 24, 17, null],
];

/**
 * Fixed 8-move cycle (dcol: + = right, drow: - = forward / toward the front)
 */
export const MOVES = [
  { dcol: -1, drow: -2 }, // 1. 左1・前2
  { dcol: 2, drow: 0 },   // 2. 右2
  { dcol: -2, drow: -2 }, // 3. 左2・前2
  { dcol: 2, drow: 0 },   // 4. 右2
  { dcol: -3, drow: -3 }, // 5. 左3・前3
  { dcol: 4, drow: 0 },   // 6. 右4
  { dcol: -4, drow: 2 },  // 7. 左4・後2
  { dcol: 4, drow: 0 },   // 8. 右4
];

const MOVE_LABELS = ['左1・前2', '右2', '左2・前2', '右2', '左3・前3', '右4', '左4・後2', '右4'];

/**
 * Build the seat grid: grid[row][col] = { number, name } | null
 */
export function buildSeatGrid() {
  return SEAT_LAYOUT.map(row =>
    row.map(n => (n === null ? null : { number: n, name: students[n - 1] }))
  );
}

/**
 * Toroidal wrap
 */
function wrap(row, col) {
  return [((row % ROWS) + ROWS) % ROWS, ((col % COLS) + COLS) % COLS];
}

/**
 * Apply one move of the cycle
 */
function applyMove(row, col, moveIndex) {
  const move = MOVES[moveIndex % MOVES.length];
  const [newRow, newCol] = wrap(row + move.drow, col + move.dcol);
  return { row: newRow, col: newCol, moveIndex: (moveIndex + 1) % MOVES.length };
}

/**
 * Find [row, col] of a student number
 */
export function findPosition(number, grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] && grid[r][c].number === number) return [r, c];
    }
  }
  return null;
}

function nextStep(row, col, moveIndex, grid) {
  const pos = applyMove(row, col, moveIndex);
  const seat = grid[pos.row]?.[pos.col] ?? null;
  if (!seat) {
    return { row: pos.row, col: pos.col, seat: null, moveIndex: pos.moveIndex, skippedEmpty: true };
  }
  return { row: pos.row, col: pos.col, seat, moveIndex: pos.moveIndex, skippedEmpty: false };
}

/**
 * Day of month → starting student number (wraps around the class size)
 */
export function getStudentNumberFromDay(day) {
  return ((day - 1) % students.length) + 1;
}

/**
 * Generate the calling order starting from a student number
 */
export function generateSequence(startNumber, count = 40, grid) {
  const result = [];
  const start = findPosition(startNumber, grid);
  if (!start) return result;

  let row = start[0];
  let col = start[1];
  let moveIndex = 0;

  result.push({
    number: grid[row][col].number,
    name: grid[row][col].name,
    moveDesc: '最初の人'
  });

  while (result.length < count) {
    let guard = 10;
    while (guard-- > 0) {
      const step = nextStep(row, col, moveIndex, grid);
      row = step.row;
      col = step.col;
      moveIndex = step.moveIndex;
      if (!step.skippedEmpty) {
        const label = MOVE_LABELS[(moveIndex - 1 + MOVES.length) % MOVES.length];
        result.push({ number: step.seat.number, name: step.seat.name, moveDesc: label });
        break;
      }
    }
  }

  return result;
}
