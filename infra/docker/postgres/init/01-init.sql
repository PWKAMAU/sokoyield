-- Runs once on first container start (empty data volume).
-- Creates the isolated test database used by API e2e tests and CI.
CREATE DATABASE sokoyield_test;

-- Extensions needed by later phases that are safe to enable now.
\connect sokoyield
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
\connect sokoyield_test
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
