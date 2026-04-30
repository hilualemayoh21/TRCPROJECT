import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log("🔍 Validating migration safety...");

const FORBIDDEN = [/DROP\s+COLUMN/i, /RENAME\s+COLUMN/i, /DROP\s+TABLE/i, /RENAME\s+TABLE/i];
const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');

if (fs.existsSync(migrationsDir)) {
  const files = fs.readdirSync(migrationsDir, { recursive: true }) as string[];
  const sqlFiles = files.filter(f => f.endsWith('.sql'));

  for (const file of sqlFiles) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    for (const pattern of FORBIDDEN) {
      if (pattern.test(content)) {
        console.error(`❌ ERROR: Destructive operation detected in ${file}: '${pattern.source}'`);
        console.error("⚠️  Enterprise policy requires zero-downtime (Expand-Only) migrations.");
        console.error("👉 Please follow the 2-Step Deployment strategy.");
        process.exit(1);
      }
    }
  }
}

console.log("✅ Migration validated as safe (Expand-Only).");
console.log("🚀 Applying migrations...");

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log("✨ Migrations complete.");
} catch (error) {
  console.error("❌ Migration failed (check DB connection).");
  process.exit(1);
}
