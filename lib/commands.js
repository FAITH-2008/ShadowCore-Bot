async function handleCommand(sock, sender, text) {

  const send = (msg) => sock.sendMessage(sender, { text: msg });

  if (text === "start") return send("Bot is active ⚡");
  if (text === "ping") return send("Pong ⚡");
  if (text === "alive") return send("I am alive 🟢");
  if (text === "menu") return send("AI | Media | Group | Fun");

  if (text.startsWith("ai ")) return send("AI: " + text.slice(3));
  if (text.startsWith("ask ")) return send("Answer: " + text.slice(4));

  if (text === "song") return send("Send song name 🎵");
  if (text === "video") return send("Send video name 🎥");
  if (text === "play") return send("Playing music 🎧");

  if (text === "sticker") return send("Reply with image/video");

  if (text === "tagall") return send("Mentioning everyone 📣");
  if (text === "kick") return send("Kick command triggered");

  if (text === "joke") return send("Why did chicken cross road? 😂");
  if (text === "meme") return send("Here is a meme 🤣");

  return send("Command not found ❌");
}

module.exports = { handleCommand };
