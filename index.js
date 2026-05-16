const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const P = require("pino")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" })
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            console.log("Connection closed. Reconnecting:", shouldReconnect)

            if (shouldReconnect) {
                startBot()
            }
        }

        if (connection === "open") {
            console.log("✅ Bot is now online!")
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        const sender = msg.key.remoteJid

        console.log("Message:", text)

        // 🔥 COMMANDS
        if (text.toLowerCase() === "hi") {
            await sock.sendMessage(sender, { text: "Hello 👋 I'm alive!" })
        }

        if (text.toLowerCase() === "ping") {
            await sock.sendMessage(sender, { text: "Pong 🏓" })
        }

        if (text.toLowerCase() === "menu") {
            await sock.sendMessage(sender, {
                text: "🤖 *Bot Menu*\n\n• hi\n• ping\n• menu"
            })
        }
    })
}

startBot()
