// src/lib/recipes/recipeDb.ts

import "server-only";

import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export type QueryParamValue =
  | string
  | number
  | boolean
  | Date
  | null;

export type QueryParams = QueryParamValue[];

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

export function getRecipeDbPool() {
  if (pool) return pool;

  const socketPath = process.env.CMS_DB_SOCKET;

  const baseConfig = {
    database: requiredEnv("CMS_DB_NAME"),
    user: requiredEnv("CMS_DB_USER"),
    password: requiredEnv("CMS_DB_PASSWORD"),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    dateStrings: true,
  };

  if (socketPath) {
    pool = mysql.createPool({
      ...baseConfig,
      socketPath,
    });

    return pool;
  }

  const port = Number(
    process.env.CMS_DB_PORT ?? "3306"
  );

  if (!Number.isInteger(port)) {
    throw new Error(
      "CMS_DB_PORT must be a valid integer"
    );
  }

  pool = mysql.createPool({
    ...baseConfig,
    host: requiredEnv("CMS_DB_HOST"),
    port,
  });

  return pool;
}

export async function queryRows<T>(
  sql: string,
  params: QueryParams = []
): Promise<T[]> {
  const db = getRecipeDbPool();

  const [rows] = await db.query(sql, params);

  return rows as T[];
}

export async function queryOne<T>(
  sql: string,
  params: QueryParams = []
): Promise<T | null> {
  const rows = await queryRows<T>(sql, params);

  return rows[0] ?? null;
}

export async function executeMutation(
  sql: string,
  params: QueryParams = []
): Promise<mysql.ResultSetHeader> {
  const db = getRecipeDbPool();

  const [result] = await db.execute<mysql.ResultSetHeader>(
    sql,
    params
  );

  return result;
}