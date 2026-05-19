// src/lib/recipes/recipeDb.ts

import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export type QueryParamValue =
  | string
  | number
  | boolean
  | Date
  | null;

export function getRecipeDbPool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.CMS_DB_HOST,
    port: Number(process.env.CMS_DB_PORT ?? 3306),
    database: process.env.CMS_DB_NAME,
    user: process.env.CMS_DB_USER,
    password: process.env.CMS_DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function queryRows<T>(
  sql: string,
  params: QueryParamValue[] = []
): Promise<T[]> {
  const db = getRecipeDbPool();
  const [rows] = await db.execute(sql, params);

  return rows as T[];
}