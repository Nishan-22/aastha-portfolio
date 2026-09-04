import "dotenv/config";
import app from "./app.js";
import { hasStoredPassword } from "./lib/auth.js";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  if (!process.env.ADMIN_PASSWORD && !(await hasStoredPassword())) {
    throw new Error(
      "No admin password configured. Set ADMIN_PASSWORD or change the password from the admin panel."
    );
  }
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start:", err instanceof Error ? err.message : err);
  process.exit(1);
});
