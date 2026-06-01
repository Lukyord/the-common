-- Fix half-finished branches table rebuild (see docs/local-drizzle-push-errors.md).
DROP TABLE IF EXISTS __new_branches;
