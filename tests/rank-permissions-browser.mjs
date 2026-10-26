// Isolated HTTP server and fake state from the permission integration test; never production.
process.env.DOJ_RANK_BROWSER='1';
await import('./rank-permissions.test.mjs');
