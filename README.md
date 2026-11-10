# 📋 TaskMaster Dashboard

A comprehensive and modern web application for **task management, project tracking, and team workload analytics**, designed and developed to practice and showcase advanced front-end architecture and React development skills.

## ✨ Features

- 🔐 Multi-user authentication (Login, Sign Up) and 3-step password recovery with a 5-digit OTP and 2-minute countdown timer
- 🌐 100% Bilingual interface (English / Persian) powered by `react-i18next` with automatic RTL/LTR layout switching and Vazirmatn font integration
- 📌 Interactive 4-stage Kanban Board (`To Do`, `In Progress`, `Review`, `Done`) for visual task progression
- 📊 Real-time Analytics & Overview dashboards featuring dynamic SVG charts, completion rates, and workload distribution
- 🔍 Instant Live Search with an interactive dropdown and multi-tab task filtering
- 🧭 Interactive step-by-step Onboarding Tour with spotlight highlighting for first-time users
- 🌗 Dark and Light theme support alongside JSON workspace data export
- 💾 Utilizing Local Storage and Context API to persist isolated user workspaces and preferences across page reloads
- 📱 Fully responsive design with a mobile drawer menu for seamless use across all screen sizes

## 🛠️ Technologies Used

- HTML5
- CSS3 (CSS Modules & CSS Variables)
- JavaScript (ES6+)
- React (Context API, Hooks, React Router v6)
- i18next (`react-i18next`)
- React Icons

## 📂 Project Structure

```text
TASKMASTER/
│
├── public/
│
└── src/
    ├── Components/
    │   ├── Header/
    │   │   ├── Header.jsx
    │   │   └── Header.module.css
    │   ├── Sidebar/
    │   │   ├── Sidebar.jsx
    │   │   └── Sidebar.module.css
    │   ├── NewTaskModal/
    │   │   ├── NewTaskModal.jsx
    │   │   └── NewTaskModal.module.css
    │   └── OnboardingTour/
    │       ├── OnboardingTour.jsx
    │       └── OnboardingTour.module.css
    │
    ├── Context/
    │   └── TaskContext.jsx
    │
    ├── Pages/
    │   ├── Auth/
    │   │   ├── Auth.jsx
    │   │   └── Auth.module.css
    │   ├── Overview/
    │   │   ├── Overview.jsx
    │   │   └── Overview.module.css
    │   ├── MyTasks/
    │   │   ├── MyTasks.jsx
    │   │   └── MyTasks.module.css
    │   ├── Projects/
    │   │   ├── Projects.jsx
    │   │   └── Projects.module.css
    │   ├── Kanban/
    │   │   ├── Kanban.jsx
    │   │   └── Kanban.module.css
    │   ├── Analytics/
    │   │   ├── Analytics.jsx
    │   │   └── Analytics.module.css
    │   ├── Settings/
    │   │   ├── Settings.jsx
    │   │   └── Settings.module.css
    │   └── NotFound/
    │       ├── NotFound.jsx
    │       └── NotFound.module.css
    │
    ├── App.css
    ├── App.jsx
    ├── i18n.js
    └── main.jsx
```

## 🎯 Project Goal

This project was created to practice and master **scalable React architecture, global state management with Context API, multi-language localization (i18n), client-side data persistence, and building rich, interactive dashboard interfaces**.

## 👨‍💻 Developer

**Mojtaba Tahmasebi**

---

⭐ If you find this project useful, feel free to **Star the repository**.
