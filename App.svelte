<script>
  // 生徒データ（写真の出席番号順：404-1 〜 404-39）
  const students = {
    1: "天野 紗希",   2: "岩澤 爾七",   3: "岩舘 美桜",   4: "大住 旬",
    5: "大八木 桃実", 6: "大山 航平",   7: "沖 愛佳",     8: "小野 遥",
    9: "上條 優衣",   10: "川原 愛生",  11: "黒川 晃世",  12: "郷地 翔大",
    13: "小島 朱莉",  14: "小林 美海",  15: "頃安 誠",
    16: "崔 紗会",     17: "佐子 凜夏",  18: "鈴木 僚太",  19: "瀬戸 康太",
    20: "高橋 直太",  21: "瀧澤 涼",    22: "武田 頼景",  23: "田中 譲太郎",
    24: "土蔵 創一",  25: "中尾 結衣子", 26: "中村 純羽",  27: "橋本 かれん",
    28: "東 暖大",    29: "平井 結芽",  30: "福島 創士",  31: "藤井 千夏",
    32: "古谷 太一",  33: "壬生 周太郎", 34: "宮田 花帆",  35: "宮本 航希",
    36: "柳川 大河",  37: "山崎 唯翔",  38: "横山 蓉",    39: "吉田 芽生"
  };

  // 写真の新しい座席配置（5/22〜の席替え対応版）
  const seatLayout = [
    // 1行目（教卓のすぐ後ろ）
    [null, {num: 30, name: "福島 創士"}, {num: 15, name: "頃安 誠"}, {num: 31, name: "藤井 千夏"}, {num: 16, name: "崔 紗会"}, {num: 5, name: "大八木 桃実"}, null],
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

  let history = [];
  let currentSeat = null;
  let candidates = [];

  // ナイトの動き（L字）が可能な席を計算する関数
  function getKnightMoves(row, col) {
    const moves = [
      { r: -2, c: -1 }, { r: -2, c: 1 },
      { r: -1, c: -2 }, { r: -1, c: 2 },
      { r: 1, c: -2 },  { r: 1, c: 2 },
      { r: 2, c: -1 },  { r: 2, c: 1 }
    ];

    let validMoves = [];

    for (let m of moves) {
      const newRow = row + m.r;
      const newCol = col + m.c;

      // グリッドの範囲内かチェック
      if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7) {
        const targetSeat = seatLayout[newRow][newCol];
        // 空席(null)でなければ候補に入れる
        if (targetSeat !== null) {
          validMoves.push(targetSeat);
        }
      }
    }
    return validMoves;
  }

  // 席がクリックされたときの処理
  function handleSeatClick(seat, r, c) {
    if (!seat) return;

    // 初回（履歴なし）なら誰でも選べる、2回目以降はナイトの候補席しか選べない
    if (history.length > 0 && !candidates.some(id => id.num === seat.num)) {
      return;
    }

    currentSeat = seat;
    history = [...history, seat];
    candidates = getKnightMoves(r, c);
  }

  // 各種状態判定
  function isSelected(seat) {
    return currentSeat && currentSeat.num === seat?.num;
  }

  function isPast(seat) {
    if (!seat) return false;
    return history.slice(0, -1).some(h => h.num === seat.num);
  }

  function isCandidate(seat) {
    if (!seat || isPast(seat) || isSelected(seat)) return false;
    return candidates.some(c => c.num === seat.num);
  }

  // リセット
  function reset() {
    history = [];
    currentSeat = null;
    candidates = [];
  }
</script>

<main class="min-h-screen bg-slate-100 p-4 font-sans select-none text-slate-800">
  <div class="max-w-4xl mx-auto space-y-6">
    
    <header class="text-center bg-white p-4 rounded-xl shadow-md border border-slate-200">
      <h1 class="text-2xl font-black text-blue-600 tracking-wider">🎯 404HR 数学 席順シミュレーター</h1>
      <p class="text-xs text-slate-500 mt-1">チェスのナイトの動き（L字ジャンプ）を完全先読み</p>
    </header>

    <div class="bg-white p-4 rounded-xl shadow-md border border-slate-200 space-y-4">
      <div class="flex justify-between items-center">
        <div class="flex gap-4 text-xs">
          <div class="flex items-center gap-1"><span class="w-4 h-4 bg-red-500 border rounded"></span>現在</div>
          <div class="flex items-center gap-1"><span class="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></span>次候補</div>
          <div class="flex items-center gap-1"><span class="w-4 h-4 bg-gray-300 border rounded"></span>指名済</div>
        </div>
        <button on:click={reset} class="bg-slate-600 hover:bg-slate-700 text-white font-bold text-sm px-4 py-1.5 rounded-lg shadowTransition shadow-sm">
          リセット
        </button>
      </div>

      <div class="w-1/3 mx-auto bg-slate-200 text-slate-600 text-center font-bold text-sm py-2 rounded-md border border-slate-300">
        【 教 卓 】
      </div>

      <div class="grid grid-cols-7 gap-2 max-w-3xl mx-auto pt-2">
        {#each seatLayout as row, r}
          {#each row as seat, c}
            <div
              class="
                flex flex-col justify-center items-center rounded-lg border h-16 transition-all duration-200
                {seat === null ? 'border-transparent bg-transparent opacity-0' : ''}
                {isSelected(seat) ? 'bg-red-500 text-white shadow-lg scale-105 border-red-700 font-black z-10' : ''}
                {isPast(seat) ? 'bg-gray-300 text-gray-500 border-gray-400 opacity-60' : ''}
                {isCandidate(seat) ? 'bg-yellow-200 border-yellow-500 cursor-pointer hover:bg-yellow-300 shadow-md animate-pulse' : ''}
                {!isSelected(seat) && !isPast(seat) && !isCandidate(seat) && seat !== null ? 'bg-white border-slate-300 shadow-sm' : ''}
                {history.length === 0 && seat !== null ? 'cursor-pointer hover:bg-blue-50 border-blue-400' : ''}
              "
              on:click={() => handleSeatClick(seat, r, c)}
            >
              {#if seat}
                <span class="text-[10px] font-mono leading-none mb-1 opacity-70">{seat.num}番</span>
                <span class="font-bold text-xs sm:text-sm text-center leading-tight tracking-tight px-1">{seat.name}</span>
              {/if}
            </div>
          {/each}
        {/each}
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-md border border-slate-200">
      <h2 class="text-base font-bold mb-3 flex items-center gap-1 text-slate-700">
        📋 本日の指名履歴
      </h2>
      {#if history.length === 0}
        <p class="text-sm text-slate-400 py-2">最初の生徒（日付の番号など）を上の座席表からタップしてスタート！</p>
      {:else}
        <div class="flex flex-wrap gap-2 items-center">
          {#each history as h, i}
            <div class="flex items-center gap-1">
              <span class="bg-slate-100 border px-2 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1 {i === history.length - 1 ? 'border-red-500 bg-red-50 text-red-700 font-bold' : ''}">
                <span class="text-[10px] text-slate-400">{i + 1}.</span> {h.name}
              </span>
              {#if i < history.length - 1}
                <span class="text-slate-400 text-sm">➔</span>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>

  </div>
</main>

<style>
  /* 微調整用のスタイルを追加したい場合はここに */
</style>
