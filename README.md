# CodeKids — 小學編程學習平台

React + Tailwind CSS + Firebase Auth / Firestore 的小學 Python 教學網站。

## 功能

- 首頁右上角登入（Google 為主，電郵可選）
- 中間按鈕進入 Python 第一章課程
- 登入後可將學習進度寫入 Firestore

## 開始使用

```bash
npm install
npm run dev
```

## Firebase 設定

請在 [Firebase Console](https://console.firebase.google.com/) 啟用：

1. **Authentication** → Sign-in method → **Google** → Enable（並填支援電郵）
2. **Authentication** → Sign-in method → Email/Password（可選）
3. **Firestore Database** → 建立資料庫
4. 若本機測試出現 unauthorized domain，在 Authentication → Settings → Authorized domains 加入 `localhost`

管理員帳戶：`st1556192@cskphc.edu.mo`、`st1555410@cskphc.edu.mo`（用這些電郵登入後，右上角會出現「管理」）。

建議 Firestore 規則（見 `firestore.rules`）：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    function isAdmin() {
      return isSignedIn()
        && request.auth.token.email in [
          'st1556192@cskphc.edu.mo',
          'st1555410@cskphc.edu.mo'
        ];
    }
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```
