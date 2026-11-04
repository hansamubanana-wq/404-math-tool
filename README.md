# 404HR 数学A

授業日の「日」から最初の生徒を決め、座席表上の固定8手サイクル（トーラス状に端で折り返し）で指名順を40人分表示するツール。

- 本番: https://math-a-404.vercel.app/
- SvelteKit (Svelte 5) + Tailwind CSS v4

```bash
npm install
npm run dev
```

生徒名簿・空席・席の入れ替え・移動パターンは `src/lib/data.js` にあります。
