# discord-invitecard-generator
2025/10/29追記: API化しました

招待コードを入力してサーバー招待画像を生成するコードです  
ブラウザのコンソールまたはブックマークレットとして実行できます  
## 使い方
- APIの場合  
```
https://discord-invitecard-generator.onrender.com/api/invite-card?invite=discord.gg/xxx
```  
これで画像が返ってきます  
READMEで使う場合はこう
```
![invitecard](https://discord-invitecard-generator.onrender.com/api/invite-card?invite=discord.gg/xxx)
```  

- ブックマークレットの場合  
`invitecard-bookmarklet.js`の内容をコピーしてブックマークとして登録。
好きなページで登録したやつを押すと実行されます
- コンソールで実行する場合  
`invitecard-console.js`の内容をコピーする
Ctrl + Shift + Jでコンソールを開いてコピーした内容を貼り付け
Enterで実行

招待リンクまたはコードを入力すると画像を生成してダウンロードできるようにします。   
これはGithubのREADMEなどで使うことを想定しています。  
```
[<img width="600" height="300" alt="Discord危険情報共有鯖 #S life_card (5)" src="https://github.com/user-attachments/assets/84228c11-7cbc-4d52-a0e4-ca7450b42aa8" />](https://discord.gg/kaiji-now)
```

## 生成した画像
<img width="600" height="300" alt="Discord危険情報共有鯖 #S life_card (5)" src="https://github.com/user-attachments/assets/84228c11-7cbc-4d52-a0e4-ca7450b42aa8" />

## 注意
> [!WARNING]
> このスクリプトは非公式ツールです。Discord公式とは一切関係ありません
> レスポンスの内容が一部変更されて使えなくなる可能性があります
