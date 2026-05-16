console.log("ShadowX Bot booting...");

async function start() {
    try {
        const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
        const P = require("pino");

        const { state, saveCreds } = await useMultiFileAuthState("auth");

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: P({ level: "silent" })
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    console.log("Connection update:", connection);

    if (qr) {
        console.log("SCAN THIS QR:", qr);
    }

    if (connection === "open") {
        console.log("WhatsApp connected successfully!");
    }

    if (connection === "close") {
        console.log("Connection closed. Restarting...");
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

            if (cmd === "hi") {
                await sock.sendMessage(from, { text: "Hello 👋 ShadowX Bot is online ⚡" });
            }

            if (cmd === "menu") {
                await sock.sendMessage(from, {
                    text: "🖤 ShadowX Menu\nhi\nmenu\nping"
                });
            }

            if (cmd === "ping") {
                await sock.sendMessage(from, { text: "Pong 🏓" });
            }
        });

    } catch (err) {
        console.log("CRASH ERROR:", err);
    }
}

start();

console.log("Bot initialized...");
