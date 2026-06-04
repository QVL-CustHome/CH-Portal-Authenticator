// CH-Portail-Authenticator - point d'entree du serveur Node.js (prod)
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT ?? 3000);
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:8080";

const app = createApp({
  gatewayUrl: GATEWAY_URL,
  distDir: path.join(__dirname, "dist"),
});

app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: "INFO",
      msg: "portail demarre",
      port: PORT,
      gateway_url: GATEWAY_URL,
    })
  );
});
