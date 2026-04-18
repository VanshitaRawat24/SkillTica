import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Starting password migration...');

db.serialize(() => {
  db.all('SELECT id, password FROM users', (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      process.exit(1);
    }

    console.log(`Found ${rows.length} users to check.`);
    let migratedCount = 0;

    const migrateUser = (index) => {
      if (index === rows.length) {
        console.log(`Migration complete. ${migratedCount} passwords hashed.`);
        db.close();
        return;
      }

      const user = rows[index];
      
      // Basic check if password is already hashed (bcrypt hashes start with $2a$ or $2b$ and are 60 chars)
      const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

      if (!isHashed) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err) => {
          if (err) {
            console.error(`Error updating user ${user.id}:`, err);
          } else {
            migratedCount++;
          }
          migrateUser(index + 1);
        });
      } else {
        migrateUser(index + 1);
      }
    };

    migrateUser(0);
  });
});
