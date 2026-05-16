console.log("ShadowX Bot booting...");

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./auth");

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: P({ level: "silent" })
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", (update) => {
            const { connection } = update;
            console.log("Connection:", connection);
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
                await sock.sendMessage(from, { text: "Hello 👋 ShadowX Bot ⚡" });
            }

            if (cmd === "menu") {
                await sock.sendMessage(from, {
                    text: "🖤 ShadowX Menu\nhi - greet\nmenu - commands\nping - test"
                });
            }

            if (cmd === "ping") {
                await sock.sendMessage(from, { text: "Pong 🏓" });
            }
        });

    } catch (err) {
        console.log("Error starting bot:", err);
    }
}

startBot();

console.log("Bot started (waiting for WhatsApp connection)...");
