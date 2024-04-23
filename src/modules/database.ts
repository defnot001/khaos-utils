import { Database } from 'bun:sqlite';
import fs from 'node:fs';
import { getDbConfig } from '../helpers/config';

export class DbDriver {
	public db: Database;
	private static instance: DbDriver;
	private constructor() {
		this.db = new Database(getDbConfig(), { create: true });
		// https://bun.sh/docs/api/sqlite#wal-mode
		this.db.exec('PRAGMA journal_mode = WAL;');
		this.runMigrations();
		DbDriver.instance = this;
	}

	private runMigrations() {
		const migrationsDir = './db/migrations';
		// Load all the migrations scripts
		const migrations = fs
			.readdirSync(migrationsDir)
			.map((file) => fs.readFileSync(`${migrationsDir}/${file}`).toString());
		// Run each migration until failure
		for (const migration of migrations) {
			// We ignore empty files
			if (migration.length === 0) {
				continue;
			}
			const queries = migration.split(';');
			for (const q of queries) {
				const query = this.db.query(q);
				query.all();
				query.finalize();
			}
		}

		const query = this.db.query('select * from applications');
		console.log(query.all());
	}

	static getInstance(): DbDriver {
		if (DbDriver.instance) {
			return DbDriver.instance;
		}

		return new DbDriver();
	}
}
