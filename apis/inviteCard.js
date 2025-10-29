const axios = require("axios");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

async function renderInviteCard(inviteInput) {
  inviteInput = inviteInput.trim().replace(/^https?:\/\//, "");

  const match = inviteInput.match(/(?:discord\.gg\/|discord\.com\/invite\/)?([a-zA-Z0-9-_]+)/);
  if (!match) throw new Error("無効な招待リンクです");
  const inviteCode = match[1];

  const res = await axios.get(
    `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true&with_expiration=true&with_permissions=true`
  );
  const data = res.data;

  const guildId = data.guild.id;
  const badgeHash = data.profile?.badge_hash;
  const iconHash = data.guild.icon;

  const guildInfo = {
    name: data.guild.name,
    member_count: data.profile?.member_count ?? data.approximate_member_count ?? 0,
    online_count: data.profile?.online_count ?? data.approximate_presence_count ?? 0,
    boost_count: data.guild.premium_subscription_count ?? 0,
    boost_level: data.guild.premium_tier ?? 0,
    tag: data.profile?.tag ?? null,
    badge_url: badgeHash ? `https://cdn.discordapp.com/guild-tag-badges/${guildId}/${badgeHash}.png` : null,
    icon_url: iconHash ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png` : null,
  };

  const width = 600;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#2C2F33";
  ctx.fillRect(0, 0, width, height);

  if (guildInfo.icon_url) {
    const icon = await loadImage(guildInfo.icon_url);
    const x = 20, y = 20, size = 128, radius = 24;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + size - radius, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
    ctx.lineTo(x + size, y + size - radius);
    ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
    ctx.lineTo(x + radius, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(icon, x, y, size, size);
    ctx.restore();
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 30px 'Noto Sans JP'";
  ctx.fillText(guildInfo.name, 170, 60);

  ctx.font = "20px 'Noto Sans JP'";
  const onlineText = `${guildInfo.online_count} Online`;
  const memberText = `${guildInfo.member_count} Members`;

  ctx.fillStyle = "#57F287";
  ctx.fillText(onlineText, 170, 100);

  const onlineWidth = ctx.measureText(onlineText).width;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(memberText, 170 + onlineWidth + 20, 100);

  ctx.font = "20px 'Noto Sans JP'";
  const baseY = 150;
  const badgeSize = 24;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Tag:", 170, baseY);

  if (guildInfo.badge_url) {
    const badgeImg = await loadImage(guildInfo.badge_url);

    const tagLabelWidth = ctx.measureText("Tag:").width;

    const badgeX = 170 + tagLabelWidth+8 ;
    const fontSize = 20;
    const badgeY = baseY - badgeSize / 2 + fontSize / 2 - 15;

    ctx.drawImage(badgeImg, badgeX, badgeY, badgeSize, badgeSize);

    const nameX = badgeX + badgeSize + 8;
    ctx.fillText(guildInfo.tag || "-", nameX, baseY);
  } else {
    ctx.fillText(guildInfo.tag || "-", 170 + ctx.measureText("Tag: ").width, baseY);
  }

  const btnWidth = 260;
  const btnHeight = 50;
  const btnX = width / 2 - btnWidth / 2;
  const btnY = height - btnHeight - 30;

  ctx.fillStyle = "#5865F2";
  ctx.beginPath();
  ctx.moveTo(btnX + 10, btnY);
  ctx.lineTo(btnX + btnWidth - 10, btnY);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + 10);
  ctx.lineTo(btnX + btnWidth, btnY + btnHeight - 10);
  ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - 10, btnY + btnHeight);
  ctx.lineTo(btnX + 10, btnY + btnHeight);
  ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - 10);
  ctx.lineTo(btnX, btnY + 10);
  ctx.quadraticCurveTo(btnX, btnY, btnX + 10, btnY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 22px 'Noto Sans JP'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("JOIN NOW", btnX + btnWidth / 2, btnY + btnHeight / 2);

  return canvas.toBuffer("image/png");
}

module.exports = { renderInviteCard };
