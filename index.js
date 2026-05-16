const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const P = require("pino");

console.log("🚀 ShadowX Bot starting...");

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./auth");

        const sock = makeWASocket({
            auth: state,
            logger: P({ level: "silent" })
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect, qr } = update;

            console.log("📡 Connection status:", connection);

            if (qr) {
                console.log("📲 SCAN THIS QR (open WhatsApp → Linked devices):", qr);
            }

            if (connection === "open") {
                console.log("✅ WhatsApp connected successfully!");
            }

            if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode;

                console.log("❌ Connection closed. Reason:", reason);

                // auto restart
                if (reason !== DisconnectReason.loggedOut) {
                    console.log("🔄 Restarting bot...");
                    startBot();
                } else {
                    console.log("⚠️ Logged out. Please rescan QR.");
                }
            }
        });

        sock.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text;

            if (!text) return;

            const cmd = text.toLowerCase();

            console.log("📩 Message:", cmd);

            if (cmd === "hi") {
                await sock.sendMessage(from, { text: "Hello 👋 ShadowX Bot ⚡" });
            }

            if (cmd === "menu") {
                await sock.sendMessage(from, {
                    text: "🖤 ShadowX Bot Menu\nhi - greet\nmenu - commands\nping - test"
                });
            }

            if (cmd === "ping") {
                await sock.sendMessage(from, { text: "🏓 Pong! Bot is alive" });
            }
        });

    } catch (err) {
        console.log("💥 Fatal error:", err);
        setTimeout(startBot, 5000);
    }
}

startBot();
