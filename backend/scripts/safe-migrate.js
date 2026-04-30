"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log("🔍 Validating migration safety...");
const FORBIDDEN = [/DROP\s+COLUMN/i, /RENAME\s+COLUMN/i, /DROP\s+TABLE/i, /RENAME\s+TABLE/i];
const migrationsDir = path_1.default.join(process.cwd(), 'prisma', 'migrations');
if (fs_1.default.existsSync(migrationsDir)) {
    const files = fs_1.default.readdirSync(migrationsDir, { recursive: true });
    const sqlFiles = files.filter(f => f.endsWith('.sql'));
    for (const file of sqlFiles) {
        const content = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), 'utf8');
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
    (0, child_process_1.execSync)('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log("✨ Migrations complete.");
}
catch (error) {
    console.error("❌ Migration failed (check DB connection).");
    process.exit(1);
}
//# sourceMappingURL=safe-migrate.js.map