<p align="center">
  <img src="assets/banner.png" alt="StreamFlix Banner" width="100%">
</p>

<h1 align="center">🎬 StreamFlix</h1>

<p align="center">
  <strong>AI-Powered Netflix-Inspired Streaming Platform</strong><br>
  Discover content using <b>Vibe Match</b>, enjoy multi-profile support, authentication,
  personalized recommendations, and a custom streaming player.
</p>

<p align="center">
  <a href="https://your-vercel-app.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit-red?style=for-the-badge">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
  </a>
  <img src="https://img.shields.io/badge/HTML5-orange?style=for-the-badge&logo=html5">
  <img src="https://img.shields.io/badge/CSS3-blue?style=for-the-badge&logo=css3">
  <img src="https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript">
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel">
</p>

---

# ✨ Overview

**StreamFlix** is a Netflix-inspired streaming platform built entirely using **HTML, CSS, and Vanilla JavaScript**.

Unlike a traditional streaming clone, StreamFlix introduces **Vibe Match**, an AI-inspired recommendation experience that instantly re-ranks the catalog according to the user's **current mood** and **available viewing time**, while keeping all recommendation logic inside the browser.

No frameworks.
No backend.
No build tools.

Everything runs directly in the browser.

---

# 🚀 Live Demo

> 🌐 https://your-vercel-app.vercel.app

---

# 📸 Preview

## Home

<p align="center">
<img src="assets/home.png" width="90%">
</p>

## Vibe Match

<p align="center">
<img src="assets/vibe-match.png" width="90%">
</p>

## Player

<p align="center">
<img src="assets/player.png" width="90%">
</p>

---

# ⭐ Features

### 🎯 AI Vibe Match

- Mood-based recommendations
- Time-aware suggestions
- Client-side recommendation engine
- Zero tracking

---

### 👤 Multi Profile Support

- Multiple users
- Kids profile
- Individual watch history
- Separate My List

---

### 🎥 Streaming Player

- Play / Pause
- Skip Intro
- Playback Speed
- Captions
- Continue Watching
- Resume Playback
- Fullscreen Mode

---

### 🔍 Search

- Instant filtering
- Search by title
- Search by cast
- Search by genre

---

### ❤️ Personalization

- My List
- Like / Dislike
- Continue Watching
- Personalized recommendations

---

### 🔐 Authentication

- Sign Up
- Login
- Session persistence
- Local Storage support

---

# 💡 What Makes StreamFlix Different?

Unlike most Netflix clones, StreamFlix introduces a unique recommendation experience.

### 🔥 Vibe Match

Instead of recommending titles based only on watch history,

StreamFlix asks:

> **"How do you feel today?"**

Choose

- ☕ Cozy
- 😂 Funny
- ⚡ Action
- 💛 Heartfelt
- 🧠 Mind-bending

Then choose

- Under 45 min
- 1–2 hours
- Binge Mode

The application instantly re-ranks every title **inside your browser** without sending any viewing data anywhere.

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript (ES6+) | Application Logic |
| Local Storage | Authentication & Session |
| Google Fonts | Typography |
| Picsum Photos | Artwork |
| Blender Open Movies | Demo Videos |
| Vercel | Deployment |

---

# 📂 Project Structure

```text
streamflix/
│
├── index.html
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── navbar.css
│   ├── hero.css
│   ├── cards.css
│   ├── modal.css
│   ├── auth.css
│   ├── player.css
│   ├── vibe.css
│   ├── footer.css
│   └── responsive.css
│
├── js/
│   ├── utils.js
│   ├── storage.js
│   ├── profile.js
│   ├── data.js
│   ├── cards.js
│   ├── modal.js
│   ├── player.js
│   ├── auth.js
│   ├── recommendations.js
│   ├── notifications.js
│   ├── search.js
│   ├── continueWatching.js
│   ├── navbar.js
│   ├── myList.js
│   └── app.js
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# ⚙️ Getting Started

Clone the repository

```bash
git clone https://github.com/harshil208/Netflix_clone.git
```

Go inside

```bash
cd Netflix_clone
```

Run a local server

```bash
python3 -m http.server 8000
```

or

```bash
npx serve .
```

Open

```
http://localhost:8000
```

---

# 🏗 Architecture

```text
User
 │
 ▼
Authentication
 │
 ▼
Profile Selection
 │
 ▼
Home
 │
 ├──────────────┐
 ▼              ▼
Search      Vibe Match
 │              │
 ▼              ▼
Catalog    Recommendation Engine
 │
 ▼
Player
 │
 ▼
Continue Watching
```

---

# 📈 Future Improvements

- AI-powered natural language search
- Watch Party
- Voice Search
- Smart Subtitle Translation
- Offline Downloads
- Dark/Light Themes
- Movie Reviews
- Trending Analytics
- Backend Integration
- Firebase Authentication

---

# 📜 Notes

- Playback uses Creative Commons demo videos.
- Artwork is placeholder content.
- Authentication is for demonstration only.
- Recommendation logic is fully client-side.

---

# 🤝 Contributing

Contributions are welcome.

Fork the repository

Create a new branch

Submit a Pull Request

---

# 📄 License

Released under the **MIT License**.

See **LICENSE** for details.

---

<p align="center">

⭐ If you enjoyed this project, consider giving it a star!



</p>
