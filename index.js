const express = require("express");
const { renderInviteCard } = require("./apis/inviteCard");
const registerFonts = require("./lib/registerFonts");

const app = express();
const PORT = process.env.PORT || 3000;
registerFonts();

app.get("/api/invite-card", async (req, res) => {
  const { invite } = req.query;
  if (!invite) {
    return res.status(400).json({ error: "inviteパラメータが必要です\n/api/invite-card?invite=discord.gg/xxx" });
  }

  try {
    const imageBuffer = await renderInviteCard(invite);
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error generating card:", err.message);
    res.status(500).json({ error: "カード生成中にエラーが発生しました。" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
