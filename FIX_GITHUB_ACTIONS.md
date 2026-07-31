# Fix red GitHub Actions (do this once)

Your [Actions tab](https://github.com/alitenhove/Saudi-Athlete-Dashboard/actions) fails because **`main` on GitHub still has a TypeScript bug** in `src/types/athlete.ts` (line ~98). Fixes in this Cursor folder are **not on GitHub** until you commit and push from the repo GitHub Desktop uses.

## Option A — Copy this folder (recommended)

1. In **GitHub Desktop**, select **Saudi-Athlete-Dashboard** → **Repository → Show in Explorer**.
2. Copy **everything** from this Cursor project folder **into** that Explorer folder (overwrite when asked):
   - `C:\Users\atenhove\.cursor\projects\C-Users-atenhove-AppData-Local-Temp-85ae8c8e-3afb-4e98-8cbb-a91d6edcdfd4\athlete-fitness-dashboard`
3. In GitHub Desktop, commit with message: **Fix CI: athlete enrichAthletes types; remove duplicate Pages workflow**
4. **Push origin**.
5. Wait ~1 minute. **Build and publish to gh-pages branch** should turn green.
6. Delete the extra workflow on GitHub (stops double red runs):
   - Open https://github.com/alitenhove/Saudi-Athlete-Dashboard/blob/main/.github/workflows/deploy-github-pages.yml
   - Trash icon → commit **Remove deploy-github-pages.yml**

## Option B — Edit on GitHub (2 minutes, no copy)

1. Open https://github.com/alitenhove/Saudi-Athlete-Dashboard/edit/main/src/types/athlete.ts
2. Replace the whole `enrichAthletes` function with:

```typescript
export function enrichAthletes(athletes: Athlete[]): AthleteComputed[] {
  const base = athletes.map(computeAthlete);
  const computed: AthleteComputed[] = base.map((a) => ({
    ...a,
    matchedSports: [],
  }));
  return computed.map((a) => ({
    ...a,
    matchedSports: matchTargetSports(a, computed),
  }));
}
```

3. Commit to **main**.
4. Delete `.github/workflows/deploy-github-pages.yml` as in step 6 above.

## After green build

- **Pages** should stay: Settings → Pages → branch **`gh-pages`** / **`/`**
- Live site: https://alitenhove.github.io/Saudi-Athlete-Dashboard/
