import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { config } from '../config/env.js';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      charset: 'utf8mb4_unicode_ci',
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = getDbPool();
  const [rows] = await p.execute(sql, params);
  return rows as T;
}

export async function queryRow<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function withTransaction<T>(callback: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const p = getDbPool();
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
