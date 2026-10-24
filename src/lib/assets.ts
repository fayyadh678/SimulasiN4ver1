/** Resolves a file inside `public/` against the deploy base path. */
export const assetUrl = (relativePath: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const clean = relativePath.replace(/^\/+/, '');
  return `${base}${base.endsWith('/') ? '' : '/'}${clean}`;
};

/** Groups consecutive questions by reading passage for shared-passage display. */
export const groupReadingRuns = <T extends { passageId?: string }>(items: T[]) => {
  const runs: { passageId: string; items: T[] }[] = [];
  for (const item of items) {
    if (!item.passageId) continue;
    const last = runs[runs.length - 1];
    if (last && last.passageId === item.passageId) last.items.push(item);
    else runs.push({ passageId: item.passageId, items: [item] });
  }
  return runs;
};