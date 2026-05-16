console.log("🚀 ShadowX Bot starting...");

const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
});

client.on("qr", (qr) => {
    console.log("📲 SCAN THIS QR IN WHATSAPP:");
    console.log(qr);
});

client.on("ready", () => {
    console.log("✅ WhatsApp Bot is READY!");
});

client.on("message", async (msg) => {
    const text = msg.body.toLowerCase();

    if (text === "hi") {
        msg.reply("Hello 👋 ShadowX Bot is online ⚡");
    }

    if (text === "menu") {
        msg.reply("🖤 ShadowX Menu\nhi - greet\nmenu - commands\nping - test");
    }

    if (text === "ping") {
        msg.reply("🏓 Pong! Bot is alive");
    }
});

client.initialize();
