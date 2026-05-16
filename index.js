const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        if (!text) return;

        const cmd = text.toLowerCase();

        console.log("Message:", cmd);

        if (cmd === "hi") {
            await sock.sendMessage(from, { text: "Hello 👋 I am ShadowX Bot ⚡" });
        }

        if (cmd === "menu") {
            await sock.sendMessage(from, {
                text: "🖤 ShadowX Bot Menu\n\nhi - greet\nmenu - show menu\nping - check bot"
            });
        }

        if (cmd === "ping") {
            await sock.sendMessage(from, { text: "Pong 🏓 Bot is alive!" });
        }
    });
}

startBot();
