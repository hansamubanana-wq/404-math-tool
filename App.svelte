<script>
  // 生徒データ
  const students = [
    "天野 紗希", "岩澤 爾七", "岩舘 美桜", "大住 旬", "大八木 桃実",
    "大山 航平", "沖 愛佳", "小野 遥", "上條 優衣", "川原 愛生",
    "黒川 晃世", "郷地 翔大", "小島 朱莉", "小林 美海", "頃安 誠",
    "崔 紗会", "佐子 凜夏", "鈴木 僚太", "瀬戸 康太", "高橋 直太",
    "瀧澤 涼", "武田 頼景", "田中 譲太郎", "土蔵 創一", "中尾 結衣子",
    "中村 純羽", "橋本 かれん", "東 暖大", "平井 結芽", "福島 創士",
    "藤井 千夏", "古谷 太一", "壬生 周太郎", "宮田 花帆", "宮本 航希",
    "柳川 大河", "山崎 唯翔", "横山 蓉", "吉田 芽生"
  ];

  const rows = 6;
  const cols = 7;
  const emptySeats = ['0,0', '5,0', '0,6']; // 左前、左後ろ、右前

  // 座席グリッドの生成
  let grid = [];
  let currentNum = 1;
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      if (emptySeats.includes(`${r},${c}`)) {
        row.push(null);
      } else {
        row.push({ r, c, num: currentNum, name: students[currentNum - 1] });
        currentNum++;
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
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !emptySeats.includes(`${nr},${nc}`)) {
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
