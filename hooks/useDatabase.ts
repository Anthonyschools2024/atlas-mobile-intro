import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

export interface Activity {
  id: number;
  steps: number;
  date: number;
}

export function useDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    async function setupDatabase() {
      const database = await SQLite.openDatabaseAsync('activities.db');
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY NOT NULL, steps INTEGER NOT NULL, date INTEGER NOT NULL);
      `);
      setDb(database);
    }
    setupDatabase();
  }, []);

  const getActivities = async (): Promise<Activity[]> => {
    if (!db) return [];
    const allRows = await db.getAllAsync<Activity>('SELECT * FROM activities ORDER BY date DESC;');
    return allRows;
  };

  const addActivity = async (steps: number, date: number): Promise<void> => {
    if (!db) return;
    await db.runAsync('INSERT INTO activities (steps, date) VALUES (?, ?);', steps, date);
  };

  return {
    db,
    getActivities,
    addActivity,
  };
}