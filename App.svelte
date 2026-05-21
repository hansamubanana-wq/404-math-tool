<script>
  // 生徒データ（写真の出席番号順：404-1 〜 404-39）
  const students = {
    1: "天野 紗希",   2: "岩澤 爾七",   3: "岩舘 美桜",   4: "大住 旬",
    5: "大八木 桃実", 6: "大山 航平",   7: "沖 愛佳",     8: "小野 遥",
    9: "上條 優衣",   10: "川原 愛生",  11: "黒川 晃世",  12: "郷地 翔大",
    13: "小島 朱莉",  14: "小林 美海",  15: "頃安 誠", // 崔紗会(404-15)と同番号のため後述の配置で吸収
    16: "崔 紗会",     17: "佐子 凜夏",  18: "鈴木 僚太",  19: "瀬戸 康太",
    20: "高橋 直太",  21: "瀧澤 涼",    22: "武田 頼景",  23: "田中 譲太郎",
    24: "土蔵 創一",  25: "中尾 結衣子", 26: "中村 純羽",  27: "橋本 かれん",
    28: "東 暖大",    29: "平井 結芽",  30: "福島 創士",  31: "藤井 千夏",
    32: "古谷 太一",  33: "壬生 周太郎", 34: "宮田 花帆",  35: "宮本 航希",
    36: "柳川 大河",  37: "山崎 唯翔",  38: "横山 蓉",    39: "吉田 芽生"
  };

  const rows = 6;
  const cols = 7;

  // 写真の座席配置（教卓側が上、1行目〜6行目、左から右へ）
  // ※崔 紗会さんと頃安 誠さんはいずれも「404-15」と書かれているため、出席番号15と16に割り振っています。
  const seatLayout = [
    // 1行目（教卓のすぐ後ろ）
    [{num: 30, name: "福島 創士"}, {num: 15, name: "頃安 誠"}, {num: 31, name: "藤井 千夏"}, {num: 16, name: "崔 紗会"}, {num: 5, name: "大八木 桃実"}, null, null],
    // 2行目
    [{num: 12, name: "郷地 翔大"}, {num: 14, name: "小林 美海"}, {num: 39, name: "吉田 芽生"}, {num: 7, name: "沖 愛佳"}, {num: 38, name: "横山 蓉"}, {num: 3, name: "岩舘 美桜"}, {num: 23, name: "田中 譲太郎"}],
    // 3行目
    [{num: 4, name: "大住 旬"}, {num: 28, name: "東 暖大"}, {num: 17, name: "佐子 凜夏"}, {num: 19, name: "瀬戸 康太"}, {num: 33, name: "壬生 周太郎"}, {num: 34, name: "宮田 花帆"}, {num: 36, name: "柳川 大河"}],
    // 4行目
    [{num: 6, name: "大山 航平"}, {num: 37, name: "山崎 唯翔"}, {num: 32, name: "古谷 太一"}, {num: 13, name: "小島 朱莉"}, {num: 8, name: "小野 遥"}, {num: 10, name: "川原 愛生"}, {num: 1, name: "天野 紗希"}],
    // 5行目
    [{num: 11, name: "黒川 晃世"}, {num: 29, name: "平井 結芽"}, {num: 35, name: "宮本 航希"}, {num: 26, name: "中村 純羽"}, {num: 9, name: "上條 優衣"}, {num: 18, name: "鈴木 僚太"}, {num: 21, name: "瀧澤 涼"}],
    // 6行目（一番後ろ）
    [null, {num: 2, name: "岩澤 爾七"}, {num: 27, name: "橋本 かれん"}, {num: 25, name: "中尾 結衣子"}, {num: 20, name: "高橋 直太"}, {num: 24, name: "土蔵 創一"}, {num: 22, name: "武田 頼景"}]
  ];

  // 座席グリッドの生成（二次元配列のオブジェクト構造を維持）
  let grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      const seat = seatLayout[r][c];
      if (seat === null) {
        row.push(null);
      } else {
        row.push({ r, c, num: seat.num, name: seat.name });
      }
    }
    grid.push(row);
  }

  // 状態管理
  let todayDate = new Date().getDate(); // 初期値は今日の日付
  let history = []; // 当てられた人の配列
  let candidates = []; // 次の候補の配列

  // リセット処理
  function reset() {
    history = [];
    candidates = [];
  }

  // 最初の1人を日付からセット
  function setFirstPerson() {
    reset();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seat = grid[r][c];
        if (seat && seat.num === todayDate) {
          selectSeat(seat);
          return;
        }
      }
    }
    alert(`${todayDate}番の生徒が見つかりません（欠席等でずれる場合は手動で選んでね）`);
  }

  // 席をクリックしたときの処理
  function handleSeatClick(seat) {
    if (!seat) return;
    // 最初の1人目か、候補の席しかクリックできないようにする
    if (history.length === 0 || candidates.some(c => c.r === seat.r && c.c === seat.c)) {
      selectSeat(seat);
    }
  }

  // 席を選択して次の候補を計算
  function selectSeat(seat) {
    history = [...history, seat];
    calcCandidates(seat);
  }

  // ナイトの動きで次の候補を計算
  function calcCandidates(seat) {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    let nextCandidates = [];
    knightMoves.forEach(([dr, dc]) => {
      const nr = seat.r + dr;
      const nc = seat.c + dc;
      
      // グリッド内で、かつ空席ではないかチェック
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && seatLayout[nr][nc] !== null) {
        // すでに当てられた人（履歴）に含まれていないかチェック
        const alreadyCalled = history.some(h => h.r === nr && h.c === nc);
        if (!alreadyCalled) {
          nextCandidates.push(grid[nr][nc]);
        }
      }
    });
    candidates = nextCandidates;
  }

  // 表示用のヘルパー関数
  function isSelected(seat) {
    if (!seat || history.length === 0) return false;
    const latest = history[history.length - 1];
    return latest.r === seat.r && latest.c === seat.c;
  }

  function isPast(seat) {
    if (!seat || history.length <= 1) return false;
    return history.slice(0, -1).some(h => h.r === seat.r && h.c === seat.c);
  }

  function isCandidate(seat) {
    if (!seat) return false;
    return candidates.some(c => c.r === seat.r && c.c === seat.c);
  }
</script>

<main class="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-6 text-blue-800">404HR 先生のナイトシミュレーター ♟️</h1>

    <div class="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center justify-center gap-4">
      <div class="flex items-center gap-2">
        <label for="date" class="font-bold">今日の日付:</label>
        <input type="number" id="date" bind:value={todayDate} min="1" max="39" class="border rounded px-2 py-1 w-16 text-center" />
      </div>
      <button on:click={setFirstPerson} class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">
        最初の人をセット
      </button>
      <button on:click={reset} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition">
        リセット
      </button>
    </div>

    <div class="w-1/2 mx-auto bg-gray-200 border-2 border-gray-400 text-center py-2 font-bold mb-8 rounded">
      教 卓
    </div>

    <div class="grid grid-cols-7 gap-2 mb-8">
      {#each grid as row}
        {#each row as seat}
          <div 
            class="h-20 border rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-300
              {seat === null ? 'invisible' : ''}
              {isSelected(seat) ? 'bg-red-500 text-white shadow-lg scale-105 border-red-700' : ''}
              {isPast(seat) ? 'bg-gray-300 text-gray-600 border-gray-400' : ''}
              {isCandidate(seat) ? 'bg-yellow-200 border-yellow-500 cursor-pointer hover:bg-yellow-300 animate-pulse' : ''}
              {!isSelected(seat) && !isPast(seat) && !isCandidate(seat) && seat !== null ? 'bg-white border-gray-300 hover:bg-blue-50' : ''}
              {history.length === 0 && seat !== null ? 'cursor-pointer hover:bg-blue-100' : ''}
            "
            on:click={() => handleSeatClick(seat)}
          >
            {#if seat}
              <span class="text-xs opacity-80">{seat.num}</span>
              <span class="font-bold text-sm text-center leading-tight">{seat.name}</span>
            {/if}
          </div>
        {/each}
      {/each}
    </div>

    <div class="bg-white p-4 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-2 border-b pb-2">🎯 当たった順番</h2>
      <ol class="list-decimal list-inside flex flex-wrap gap-x-6 gap-y-2">
        {#each history as h, i}
          <li class="{i === history.length - 1 ? 'text-red-600 font-bold' : 'text-gray-600'}">
            {h.name} <span class="text-xs opacity-75">({h.num}番)</span>
          </li>
        {/each}
        {#if history.length === 0}
          <li class="text-gray-400 list-none">まだ誰も当てられていません</li>
        {/if}
      </ol>
    </div>
  </div>
</main>

<style>
  /* Tailwindを使っているので基本CSSは不要ですが、必要に応じて追加 */
</style>
