<div align="center">

# 🚗 AI Smart Parking & Automated Vehicle Capture System

<p align="center">
  <b>Next-Generation Autonomous Parking Grid, Optical ANPR Scanner & Real-Time RTO Registry</b>
  <br>
  Built with Modern HTML5 • Cyberpunk CSS3 • Vanilla JavaScript • Tesseract OCR API
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UI-Cyberpunk%20Glassmorphism-00f2fe?style=for-the-badge" alt="UI Theme">
  <img src="https://img.shields.io/badge/OCR%20Core-Tesseract%20v4.2-10b981?style=for-the-badge" alt="OCR Version">
  <img src="https://img.shields.io/badge/Auth-Multi--User%20%26%20Storage-f43f5e?style=for-the-badge" alt="Auth System">
  <img src="https://img.shields.io/badge/Simulation-Dual%20Road%20Animation-38bdf8?style=for-the-badge" alt="Simulation">
</p>

</div>

---

## 📌 Project Overview

**AI Smart Parking System** ek modern web-based intelligent parking automation hub hai. Isme real-time **Automatic Number Plate Recognition (ANPR)** camera scanning engine, dynamic dual-lane road barriers (Entry/Exit servo simulation with realistic car drive animations), instant RTO vehicle details verification modal, aur automated duration-based digital billing matrix diya gaya hai.

---

## ✨ Key Features

| Icon | Feature | Description |
| :--- | :--- | :--- |
| 🎨 | **Cyberpunk Split-Screen Auth** | Modern visual layout with interactive Cyber-Car SVG vector diagram. |
| 🔐 | **Complete Auth Engine** | Tab-switchable Sign In, Sign Up, and Email-verified Forgot Password reset. |
| 💾 | **Credential Persistence Popup** | Session prompt to remember credentials directly in browser storage. |
| 📷 | **Live Camera & Power Controller** | Dedicated Camera ON/OFF power toggle button with offline HUD fallback. |
| 🔍 | **Optical ANPR Plate Scanner** | Integrated Tesseract.js OCR engine that validates Indian vehicle plate formats. |
| 🚘 | **Dual Lane Road & Car Animation**| Interactive left entry & right exit road lanes with animated moving cars. |
| 📋 | **RTO Vehicle Details Lookup** | Dynamic HUD modal displaying Owner Name, Vehicle Model, Fuel Type, and Timestamp. |
| 🅿️ | **Car Booking Slot Matrix** | Interactive 10-slot capacity grid supporting both manual clicks and sensor entry. |
| 💰 | **Automated Digital Billing** | Auto tariff calculation (₹5/min) and real-time transaction history logs. |

---

## 🖥️ Project Screenshots

### 1️⃣ Front Page (Split-Screen Sign In / Sign Up)
<p align="center">
  <img src="Screenshot/Front%20Page.png" width="780" alt="Front Page">
</p>

---

### 2️⃣ Camera Access Permission Prompt
<p align="center">
  <img src="Screenshot/Camera%20Allow%20Pop-up.png" width="780" alt="Camera Allow Pop-up">
</p>

---

### 3️⃣ Save Credentials Popup Toast
<p align="center">
  <img src="Screenshot/Save%20Credential.png" width="780" alt="Save Credential">
</p>

---

### 4️⃣ Camera Power Controller (Sensor Power OFF HUD)
<p align="center">
  <img src="Screenshot/Camera%20Access.png" width="780" alt="Camera Access">
</p>

---

### 5️⃣ Live Smart Parking Dashboard
<p align="center">
  <img src="Screenshot/Dashboard.png" width="780" alt="Dashboard">
</p>

---

### 6️⃣ Interactive Car Parking Slot Matrix
<p align="center">
  <img src="Screenshot/Car%20Parking%20Slot.png" width="780" alt="Car Parking Slot">
</p>

---

### 7️⃣ Dual Lane Traffic Hub (Entry & Exit Road Barriers)
<p align="center">
  <img src="Screenshot/Right%20and%20Left%20Road.png" width="780" alt="Right and Left Road">
</p>

---

### 8️⃣ AI Optical Sensor Scanning HUD
<p align="center">
  <img src="Screenshot/Camera%20Feature.png" width="780" alt="Camera Feature">
</p>

---

### 9️⃣ Automated Transaction & Billing History
<p align="center">
  <img src="Screenshot/Transaction.png" width="780" alt="Transaction">
</p>

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** HTML5 Semantic Structure, CSS3 Custom Properties & Glassmorphism Gradients, Vanilla JavaScript (ES6+ Modules & Async/Await).
- **Vision Engine:** [Tesseract.js OCR](https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js) for live optical character recognition.
- **Hardware Integration:** Browser MediaDevices Web API (`navigator.mediaDevices.getUserMedia`).
- **Data & State Management:** Client-Side `localStorage` for registered users, sessions, and transaction matrix.

---

## 🔑 Default Credentials

Aap naya account create kar sakte hain ya neeche diye gaye default admin credentials use kar sakte hain:

```text
Username : admin
Password : admin123