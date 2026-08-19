# 🚗 Smart Parking System

<p align="center">
  <b>A Smart Web-Based Parking Management System</b>
  <br>
  Built with HTML5, CSS3 & JavaScript
</p>


---

## 📌 About The Project

**Smart Parking System** is a web-based parking management application designed to simulate a modern and intelligent parking environment.

The system provides an interactive admin dashboard for monitoring parking availability, managing vehicle entry and exit, controlling parking gates, accessing a live camera feed, and maintaining parking transaction records.

> This project is currently a **frontend-based smart parking simulation** and can be extended with IoT, database, computer vision, and cloud technologies.

---

## ✨ Key Features

| Feature                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| 🔐 Admin Login         | Secure-looking admin login interface             |
| 📹 Live Camera         | Accesses the device camera using Web Camera API  |
| 🅿️ Parking Slots      | Real-time available and occupied slot monitoring |
| 🚘 Vehicle Entry       | Automatically assigns an available parking slot  |
| 🚪 Smart Gates         | Animated entry and exit gate system              |
| 🚗 Vehicle Tracking    | Generates and tracks vehicle plate numbers       |
| ⏱️ Time Tracking       | Calculates parking duration                      |
| 💰 Fee Calculation     | Automatically calculates parking charges         |
| 📋 Transaction History | Stores completed parking transactions            |
| 📊 Dashboard           | Displays total, available and occupied slots     |

---

# 🖥️ Project Screenshots

## 🔐 Front Page

<p align="center">
  <img src="Screenshot/Front Page.png" width="700">
</p>

---

## 📹 Live Camera

<p align="center">
  <img src="Screenshot/Live Camera.png" width="700">
</p>

---

## 🚪 Entry & Exit Gate

<p align="center">
  <img src="Screenshot/Gate.png" width="700">
</p>

---

## 🏠 Smart Parking Dashboard

<p align="center">
  <img src="Screenshot/Home page.png" width="700">
</p>

---

## 🅿️ Parking Slot Booking Area

<p align="center">
  <img src="Screenshot/Slot Booking Area.png" width="700">
</p>

---
## 💸 Transaction History

<p align="center">
  <img src="Screenshot/Transaction History.png" width="700">
</p>

---

# 🛠️ Technologies Used

### Frontend

* **HTML5** — Website structure
* **CSS3** — UI design, layout, animations and responsive styling
* **JavaScript** — Application logic and dynamic functionality

### Browser API

* **Web Camera API (`getUserMedia`)** — Live camera access

---

# 🔑 Admin Login

```text
Username: Binary Brain
Password: 12345
```

> ⚠️ **Note:** This is a frontend demonstration project. The credentials are currently stored directly inside JavaScript and are not suitable for production authentication.

---

# 🅿️ How The System Works

### 1️⃣ Admin Login

The administrator enters the predefined credentials to access the smart parking dashboard.

### 2️⃣ 📹 Live Camera

After successful login, the browser requests permission to access the device camera.

### 3️⃣ 🚘 Vehicle Entry

When **Vehicle Entry** is clicked:

* A vehicle number plate is generated.
* The system searches for an available slot.
* The first available slot is assigned.
* The slot changes to **Occupied**.
* Entry time is recorded.
* Entry gate opens automatically.
* Dashboard statistics are updated.

### 4️⃣ 🚗 Vehicle Exit

When **Vehicle Exit** is clicked:

* The administrator enters the parking slot number.
* The system finds the vehicle assigned to that slot.
* Parking duration is calculated.
* Parking fee is generated.
* The slot becomes available again.
* Transaction details are added to the history.
* Exit gate opens automatically.

---

# 💰 Parking Fee

The current parking rate is:

```text
₹5 per minute
```

The fee is calculated automatically according to the vehicle's parking duration.

```javascript
let ratePerMinute = 5;
```

---

# 🚪 Smart Gate System

The system contains two automated gates:

* 🟢 **Entry Gate**
* 🔴 **Exit Gate**

The gates include:

* Animated gate arms
* Red/green status lights
* Automatic opening animation
* Automatic closing after a few seconds

---

# 📊 Dashboard

The dashboard provides real-time information about:

```text
Total Parking Slots
        ↓
Available Slots
        ↓
Occupied Slots
        ↓
Live Camera
        ↓
Entry / Exit Gates
        ↓
Parking Slot Status
        ↓
Transaction History
```

---

# 📂 Project Structure

```text
Smart-Parking-System/
│
├── index.html
├── README.md
│
└── Screenshots/
    ├── Camera.png
    ├── Front-Page.png
    ├── Gate.png
    ├── Home-Page.png
    └── Slot-Booking-Area.png
```

---

# 🚀 Future Improvements

The current system can be upgraded with real-world smart parking technologies:

* 🚗 Automated vehicle detection
* 🔍 Automatic Number Plate Recognition (ANPR)
* 📡 IoT-based parking sensors
* 🗄️ Database integration
* ☁️ Cloud-based parking management
* 💳 Online payment integration
* 📱 Mobile application
* 📍 GPS-based parking locations
* 🎫 QR-based parking tickets
* 📊 Advanced parking analytics
* 👤 User registration and authentication
* 🔔 Real-time parking notifications

---

# 🎯 Project Objective

The objective of this project is to demonstrate how modern web technologies can be used to create a **Smart Parking Management System**.

The project provides a foundation for integrating **IoT, Computer Vision, Databases and Cloud Computing** into a real-world parking solution.

---

# 👨‍💻 Developer

**Smart Parking System**

Developed using:

`HTML5` • `CSS3` • `JavaScript`

---

<p align="center">
  ⭐ If you like this project, consider giving the repository a star!
</p>
