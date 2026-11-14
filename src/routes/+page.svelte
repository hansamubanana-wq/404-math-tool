<script>
  import {
    buildSeatGrid, generateSequence, getStudentNumberFromDay
  } from '$lib/data.js';

  const grid = buildSeatGrid();

  // State
  let dateInput = $state('');
  
  // Initialize with today's date
  $effect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    dateInput = `${y}-${m}-${d}`;
  });

  // Derived: student number from date
  let derivedStudentNumber = $derived.by(() => {
    if (!dateInput) return null;
    const parts = dateInput.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    if (isNaN(day) || day < 1) return null;
    return getStudentNumberFromDay(day);
  });

  // Sequence is reactively generated based on the date
  let sequence = $derived.by(() => {
    if (!derivedStudentNumber) return [];
    return generateSequence(derivedStudentNumber, 40, grid); // 40 students for today's sequence
  });

</script>

<svelte:head>
  <title>404HR 数学A</title>
</svelte:head>

<div class="min-h-screen bg-bg-primary font-noto text-text-primary selection:bg-accent-primary/20">
  <!-- Header -->
  <header class="border-b border-border-default bg-bg-secondary/90 backdrop-blur-md sticky top-0 z-10 shadow-sm transition-all duration-300">
    <div class="mx-auto max-w-3xl px-4 py-4 sm:py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-scale-in">
        <div>
          <h1 class="font-outfit text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            404HR <span class="text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-md ml-1">数学A</span>
          </h1>
        </div>

        <div class="flex items-center gap-3 bg-bg-elevated rounded-lg p-2 border border-border-default shadow-inner transition-colors hover:border-border-accent/50 focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary">
          <label for="date-input" class="text-sm font-medium text-text-secondary whitespace-nowrap">授業日:</label>
          <input
            id="date-input"
            type="date"
            bind:value={dateInput}
            class="bg-transparent text-sm text-text-primary outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-3xl px-4 py-6 sm:py-8 overflow-hidden">
    {#if sequence.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border-default rounded-xl animate-scale-in">
        <p class="text-text-muted">日付を選択してください</p>
      </div>
    {:else}
      <div class="bg-bg-secondary rounded-xl border border-border-default shadow-lg shadow-black/5 overflow-hidden animate-scale-in">
        <div class="bg-bg-elevated/50 border-b border-border-default px-4 py-3 flex items-center justify-between">
          <h2 class="text-sm font-bold text-text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            指名順一覧
          </h2>
        </div>

        <ul class="divide-y divide-border-default/50">
          {#each sequence as person, i (person.number + '-' + i)}
            <li
              class="animate-slide-in-right flex items-center px-4 py-3 sm:px-6 hover:bg-bg-elevated/30 transition-all duration-200 group"
              style="animation-delay: {Math.min(i * 30, 600)}ms; opacity: 0;"
            >
              <div class="flex-shrink-0 w-8 sm:w-12 text-center transform transition-transform duration-300 group-hover:scale-110">
                <span class="inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full shadow-sm {i === 0 ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-bold' : 'bg-bg-elevated border border-border-default text-text-secondary font-medium'} text-xs sm:text-sm">
                  {i + 1}
                </span>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm sm:text-base font-bold text-text-primary group-hover:text-accent-secondary transition-colors">{person.name}</span>
                  <span class="text-[10px] sm:text-xs text-text-muted font-mono tracking-wider opacity-70">No.{String(person.number).padStart(2, '0')}</span>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </main>
</div>
