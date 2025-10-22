(async () => {
  let inviteInput = prompt("招待コードまたはリンクを入力してください");
  if (!inviteInput) return;

  inviteInput = inviteInput.trim().replace(/^https?:\/\//, "");

  const match = inviteInput.match(/(?:discord\.gg\/|discord\.com\/invite\/)?([a-zA-Z0-9-_]+)/);
  if (!match) return alert("無効な形式です");
  const inviteCode = match[1];

  const res = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true&with_expiration=true&with_permissions=true`);
  if (!res.ok) return alert("招待コードが無効です");
  const data = await res.json();

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
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#2C2F33";
  ctx.fillRect(0, 0, width, height);

  if (guildInfo.icon_url) {
    const iconImg = new Image();
    iconImg.crossOrigin = "anonymous";
    iconImg.src = guildInfo.icon_url;
    await new Promise(resolve => (iconImg.onload = resolve));
    ctx.drawImage(iconImg, 20, 20, 128, 128);
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(guildInfo.name, 160, 50);

  ctx.font = "20px sans-serif";
  ctx.fillText(`メンバー: ${guildInfo.member_count}`, 160, 90);

  ctx.fillStyle = "#43B581";
  ctx.fillText(`(オンライン: ${guildInfo.online_count})`, 160 + ctx.measureText(`メンバー: ${guildInfo.member_count} `).width, 90);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`ブースト: ${guildInfo.boost_count} (Lv${guildInfo.boost_level})`, 160, 120);
  ctx.fillText(`タグ: ${guildInfo.tag || "-"}`, 160, 150);

  if (guildInfo.badge_url) {
    const badgeImg = new Image();
    badgeImg.crossOrigin = "anonymous";
    badgeImg.src = guildInfo.badge_url;
    await new Promise(resolve => (badgeImg.onload = resolve));
    ctx.drawImage(badgeImg, 160 + ctx.measureText(`タグ: ${guildInfo.tag || "-"}`).width + 8, 128, 24, 24);
  }

  const btnWidth = 260;
  const btnHeight = 50;
  const btnX = width / 2 - btnWidth / 2;
  const btnY = height - btnHeight - 30;

  ctx.fillStyle = "#7289DA";
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
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("JOIN NOW", btnX + btnWidth / 2, btnY + btnHeight / 2);

  const link = document.createElement("a");
  link.download = `${guildInfo.name}_card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
})();
