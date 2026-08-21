let totalSlots = 10;
let ratePerMinute = 5;
let vehicles = {};
let pendingLoginData = null;
let cameraStream = null;
let isCameraActive = false;
let currentFacingMode = "user"; // "user" (front) or "environment" (back)

// Mock Indian Vehicle RTO Registry Database
const vehicleRegistryDatabase = {
    "DL01AB1234": { owner: "Rahul Sharma", model: "Hyundai Creta SX", fuel: "Petrol" },
    "MH12DE1432": { owner: "Pooja Verma", model: "Tata Nexon EV", fuel: "Electric" },
    "MP09AB1001": { owner: "Amit Patel", model: "Mahindra Thar 4x4", fuel: "Diesel" },
    "KA05MG8899": { owner: "Vikram Reddy", model: "Kia Seltos", fuel: "Petrol" },
    "UP16CZ5544": { owner: "Neha Gupta", model: "Honda City V", fuel: "Petrol" }
};

// ==========================================
// AUTHENTICATION & LOGIN
// ==========================================

function switchAuthTab(type) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotForm = document.getElementById("forgotForm");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const authTabsContainer = document.getElementById("authTabsContainer");
    const msg = document.getElementById("authMessage");
    msg.innerText = "";

    loginForm.classList.remove("active");
    signupForm.classList.remove("active");
    forgotForm.classList.remove("active");
    loginTab.classList.remove("active");
    signupTab.classList.remove("active");
    authTabsContainer.style.display = "flex";

    if (type === 'login') {
        loginForm.classList.add("active");
        loginTab.classList.add("active");
    } else if (type === 'signup') {
        signupForm.classList.add("active");
        signupTab.classList.add("active");
    } else if (type === 'forgot') {
        forgotForm.classList.add("active");
        authTabsContainer.style.display = "none";
    }
}

function handleSignup(e) {
    e.preventDefault();
    const user = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value;
    const msg = document.getElementById("authMessage");

    let users = JSON.parse(localStorage.getItem("parking_users") || "{}");
    if (users[user]) {
        msg.style.color = "#f43f5e";
        msg.innerText = "Username already exists!";
        return;
    }

    users[user] = { email: email.toLowerCase(), password: pass };
    localStorage.setItem("parking_users", JSON.stringify(users));

    msg.style.color = "#10b981";
    msg.innerText = "Account created! Switching to Sign In...";
    setTimeout(() => {
        switchAuthTab('login');
        document.getElementById("loginUsername").value = user;
    }, 1200);
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value;
    const msg = document.getElementById("authMessage");

    let users = JSON.parse(localStorage.getItem("parking_users") || "{}");
    const isValid = (user === "admin" && pass === "admin123") || (users[user] && users[user].password === pass);

    if (isValid) {
        document.getElementById("authOverlay").style.display = "none";
        document.getElementById("dashboard").style.display = "flex";
        document.getElementById("userDisplay").innerText = "Operator: " + user;
        startCamera(currentFacingMode);

        const saved = JSON.parse(localStorage.getItem("saved_parking_session") || "null");
        if (!saved || saved.username !== user) {
            pendingLoginData = { username: user, password: pass };
            showToast("Save Credentials?", `Remember session for ${user}?`);
        }
    } else {
        msg.style.color = "#f43f5e";
        msg.innerText = "Invalid Username or Password!";
    }
}

function handleForgotPassword(e) {
    e.preventDefault();
    const user = document.getElementById("forgotUsername").value.trim();
    const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
    const newPass = document.getElementById("forgotNewPassword").value;
    const msg = document.getElementById("authMessage");

    let users = JSON.parse(localStorage.getItem("parking_users") || "{}");

    if (users[user] && users[user].email === email) {
        users[user].password = newPass;
        localStorage.setItem("parking_users", JSON.stringify(users));
        msg.style.color = "#10b981";
        msg.innerText = "Password updated! Redirecting to Sign In...";
        setTimeout(() => switchAuthTab('login'), 1500);
    } else {
        msg.style.color = "#f43f5e";
        msg.innerText = "Verification failed: User or Email mismatch.";
    }
}

function logout() {
    stopCamera();
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("authOverlay").style.display = "flex";
    switchAuthTab('login');
}

function showToast(title, message) {
    document.getElementById("toastTitle").innerText = title;
    document.getElementById("toastMessage").innerText = message;
    document.getElementById("toastNotification").style.display = "flex";
}

function closeToast() {
    document.getElementById("toastNotification").style.display = "none";
    pendingLoginData = null;
}

function acceptSaveCreds() {
    if (pendingLoginData) {
        localStorage.setItem("saved_parking_session", JSON.stringify(pendingLoginData));
    }
    closeToast();
}

// ==========================================
// CAMERA CONTROLLER & SWITCH LOGIC
// ==========================================

async function checkBackCameraAvailable() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return false;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Agar label ya settings se pata chal sake ya 2 se zyada cameras ho
        const hasBackLabel = videoDevices.some(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
        );

        return hasBackLabel || videoDevices.length > 1;
    } catch (e) {
        return false;
    }
}

function startCamera(facingMode = "user") {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    const constraints = {
        video: {
            facingMode: { exact: facingMode },
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            cameraStream = stream;
            document.getElementById("video").srcObject = stream;
            isCameraActive = true;
            currentFacingMode = facingMode;
            updateCameraUI(true);
            updateSensorStatus(`Camera Sensor Active (${facingMode === 'user' ? 'Front' : 'Back'}). Position plate inside frame.`, "idle");
            updateSwitchButtonText();
        })
        .catch(err => {
            // Fallback for browsers/devices that don't support { exact }
            navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode, width: 640, height: 480 } })
                .then(stream => {
                    cameraStream = stream;
                    document.getElementById("video").srcObject = stream;
                    isCameraActive = true;
                    currentFacingMode = facingMode;
                    updateCameraUI(true);
                    updateSensorStatus(`Camera Sensor Active (${facingMode === 'user' ? 'Front' : 'Back'}). Position plate inside frame.`, "idle");
                    updateSwitchButtonText();
                })
                .catch(() => {
                    updateCameraUI(false);
                    updateSensorStatus("Camera access denied or device unavailable.", "error");
                });
        });
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    document.getElementById("video").srcObject = null;
    isCameraActive = false;
    updateCameraUI(false);
    updateSensorStatus("Camera Sensor is currently Powered OFF.", "idle");
}

function toggleCamera() {
    if (isCameraActive) {
        stopCamera();
    } else {
        startCamera(currentFacingMode);
    }
}

async function switchCamera() {
    if (!isCameraActive) {
        alert("Pehle Camera ON karein!");
        return;
    }

    if (currentFacingMode === "user") {
        const isBackAvailable = await checkBackCameraAvailable();
        
        // Test requesting back camera
        try {
            const testStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
            testStream.getTracks().forEach(track => track.stop());
            startCamera("environment");
        } catch (err) {
            alert("⚠️ Back camera is not available on this device! Switching canceled.");
            updateSensorStatus("Back Camera unavailable. Running Front Camera.", "error");
        }
    } else {
        startCamera("user");
    }
}

function updateSwitchButtonText() {
    const switchBtn = document.getElementById("cameraSwitchBtn");
    if (!switchBtn) return;
    if (currentFacingMode === "user") {
        switchBtn.innerText = "🔄 Switch (Back)";
    } else {
        switchBtn.innerText = "🔄 Switch (Front)";
    }
}

function updateCameraUI(isActive) {
    const btn = document.getElementById("cameraToggleBtn");
    const overlay = document.getElementById("cameraOffOverlay");
    const scanOverlay = document.getElementById("scanOverlay");
    const liveIndicator = document.getElementById("liveTagIndicator");

    if (isActive) {
        btn.innerText = "📷 Camera ON";
        btn.className = "cam-toggle-btn active";
        overlay.style.display = "none";
        scanOverlay.style.display = "block";
        liveIndicator.innerHTML = '<span class="blink">●</span> AI OPTICAL SCANNER';
    } else {
        btn.innerText = "📷 Camera OFF";
        btn.className = "cam-toggle-btn off";
        overlay.style.display = "flex";
        scanOverlay.style.display = "none";
        liveIndicator.innerHTML = '● SENSOR OFFLINE';
    }
}

function updateSensorStatus(message, type) {
    const statusEl = document.getElementById("sensorStatus");
    statusEl.className = "sensor-status status-" + type;
    statusEl.innerText = message;
}

// ==========================================
// CAMERA OCR PLATE CAPTURE
// ==========================================

async function captureAndProcessPlate() {
    if (!isCameraActive) {
        updateSensorStatus("⚠️ Cannot scan: Camera is currently powered OFF. Turn it ON first.", "error");
        return;
    }

    const video = document.getElementById("video");
    const canvas = document.getElementById("captureCanvas");
    const btn = document.getElementById("btnCapture");

    if (!video.videoWidth) {
        updateSensorStatus("Sensor Offline: Camera stream not ready.", "error");
        return;
    }

    btn.disabled = true;
    updateSensorStatus("⚡ Optical Sensor Scanning Plate...", "scanning");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        const result = await Tesseract.recognize(canvas, 'eng', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        });

        const rawText = result.data.text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        console.log("OCR Detected:", rawText);

        const plateRegex = /([A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4})/;
        const match = rawText.match(plateRegex);

        if (match && match[0]) {
            processVehicleEntry(match[0]);
        } else {
            updateSensorStatus(`⚠️ [CAPTURE FAILED]: "No valid vehicle number plate detected."`, "error");
        }
    } catch (err) {
        console.error(err);
        updateSensorStatus("⚠️ Sensor OCR Processing Error.", "error");
    } finally {
        btn.disabled = false;
    }
}

function generateRandomPlate() {
    const states = ["DL", "MH", "MP", "KA", "UP"];
    const randState = states[Math.floor(Math.random() * states.length)];
    return `${randState}01AB${Math.floor(1000 + Math.random() * 9000)}`;
}

function fetchVehicleInfo(plate) {
    if (vehicleRegistryDatabase[plate]) {
        return vehicleRegistryDatabase[plate];
    }
    const randomOwners = ["Sunil Verma", "Karan Malhotra", "Ananya Deshmukh", "Rajeev Nair", "Suresh Raina"];
    const randomModels = ["Maruti Brezza", "Kia Carens", "Honda Elevate", "MG ZS EV", "Hyundai Verna"];
    const randomFuels = ["Petrol", "Diesel", "CNG", "Electric"];

    const generated = {
        owner: randomOwners[Math.floor(Math.random() * randomOwners.length)],
        model: randomModels[Math.floor(Math.random() * randomModels.length)],
        fuel: randomFuels[Math.floor(Math.random() * randomFuels.length)]
    };
    vehicleRegistryDatabase[plate] = generated;
    return generated;
}

// ==========================================
// VEHICLE ENTRY & ANIMATION LOGIC
// ==========================================

function processVehicleEntry(plate) {
    if (vehicles[plate]) {
        updateSensorStatus(`⚠️ Vehicle [${plate}] is already parked in Slot ${vehicles[plate].slot}!`, "error");
        return;
    }

    let slots = document.querySelectorAll(".slot");
    let targetSlot = null;

    for (let slot of slots) {
        if (slot.dataset.status === "available") {
            targetSlot = slot;
            break;
        }
    }

    if (!targetSlot) {
        updateSensorStatus("⚠️ Grid Alert: All parking slots are full!", "error");
        alert("PARKING FULL: No available slots for " + plate);
        return;
    }

    const vehicleData = fetchVehicleInfo(plate);
    bookSpecificSlot(targetSlot, plate, vehicleData);
}

function manualBookSlot(slotId) {
    let plate = prompt(`Enter Valid Number Plate for Slot ${slotId} (e.g. DL01AB1234):`, generateRandomPlate());
    if (!plate) return;

    plate = plate.toUpperCase().replace(/\s+/g, '');
    const plateRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

    if (!plateRegex.test(plate)) {
        alert("❌ Invalid Plate Format! Please enter a valid registration (e.g., DL01AB1234)");
        return;
    }

    let slotElem = Array.from(document.querySelectorAll(".slot")).find(s => s.dataset.slotId === slotId);
    if (slotElem) {
        const vehicleData = fetchVehicleInfo(plate);
        bookSpecificSlot(slotElem, plate, vehicleData);
    }
}

function bookSpecificSlot(slotElem, plate, vehicleData) {
    slotElem.dataset.status = "occupied";
    slotElem.className = "slot occupied";
    slotElem.innerHTML = `${slotElem.dataset.slotId}<span class="slot-tag">Parked</span>`;

    const entryDate = new Date();
    vehicles[plate] = {
        slot: slotElem.dataset.slotId,
        entry: entryDate,
        owner: vehicleData.owner,
        model: vehicleData.model,
        fuel: vehicleData.fuel
    };

    triggerEntryCarAnimation(plate);
    openGate("entryGate");
    updateDashboard();

    updateSensorStatus(`✅ [VERIFIED]: Plate ${plate} assigned to ${slotElem.dataset.slotId}. Barrier Opened!`, "success");
    displayVehicleDetailsModal(plate, slotElem.dataset.slotId, vehicleData, entryDate);
}

function triggerEntryCarAnimation(plate) {
    const entryCar = document.getElementById("entryCar");
    document.getElementById("entryCarPlate").innerText = plate.substring(0, 7);

    entryCar.classList.remove("entry-drive-active");
    void entryCar.offsetWidth;
    entryCar.classList.add("entry-drive-active");

    setTimeout(() => {
        entryCar.classList.remove("entry-drive-active");
    }, 2500);
}

function displayVehicleDetailsModal(plate, slotId, data, date) {
    document.getElementById("modalPlateNum").innerText = plate;
    document.getElementById("modalVehicleModel").innerText = data.model;
    document.getElementById("modalOwner").innerText = data.owner;
    document.getElementById("modalFuel").innerText = data.fuel;
    document.getElementById("modalSlot").innerText = "Slot " + slotId;
    document.getElementById("modalTime").innerText = date.toLocaleTimeString();

    document.getElementById("vehicleDetailsModal").style.display = "flex";
}

function closeDetailsModal() {
    document.getElementById("vehicleDetailsModal").style.display = "none";
}

// ==========================================
// VEHICLE EXIT & ANIMATION LOGIC
// ==========================================

function vehicleExit() {
    let plates = Object.keys(vehicles);
    if (plates.length === 0) {
        alert("No vehicles currently active in the parking grid.");
        return;
    }

    let slotNumber = prompt("Enter Slot Number to release (e.g. S1):");
    if (!slotNumber) return;

    slotNumber = slotNumber.toUpperCase();
    let foundPlate = null;

    for (let plate in vehicles) {
        if (vehicles[plate].slot === slotNumber) {
            foundPlate = plate;
            break;
        }
    }

    if (!foundPlate) {
        alert("No vehicle found registered in Slot " + slotNumber);
        return;
    }

    let data = vehicles[foundPlate];
    let exitTime = new Date();
    let minutes = Math.ceil((exitTime - data.entry) / 60000);
    let fee = minutes * ratePerMinute;

    let slotElem = Array.from(document.querySelectorAll(".slot")).find(s => s.dataset.slotId === data.slot);
    if (slotElem) {
        slotElem.dataset.status = "available";
        slotElem.className = "slot available";
        slotElem.innerHTML = `${data.slot}<span class="slot-tag">Free</span>`;
    }

    triggerExitCarAnimation(foundPlate);
    openGate("exitGate");

    addHistory(foundPlate, data.owner + " (" + data.model + ")", data.slot, data.entry, exitTime, "₹" + fee);
    delete vehicles[foundPlate];

    updateDashboard();
    updateSensorStatus(`➔ Vehicle [${foundPlate}] exited from ${data.slot}. Bill: ₹${fee}`, "idle");

    alert(`[BILL PROCESSED]\nVehicle: ${foundPlate} (${data.model})\nOwner: ${data.owner}\nDuration: ${minutes} min\nTotal Charged: ₹${fee}\nExit Barrier Opened.`);
}

function triggerExitCarAnimation(plate) {
    const exitCar = document.getElementById("exitCar");
    document.getElementById("exitCarPlate").innerText = plate.substring(0, 7);

    exitCar.classList.remove("exit-drive-active");
    void exitCar.offsetWidth;
    exitCar.classList.add("exit-drive-active");

    setTimeout(() => {
        exitCar.classList.remove("exit-drive-active");
    }, 2500);
}

function addHistory(plate, details, slot, entry, exit, fee) {
    let table = document.getElementById("historyTable");
    let row = table.insertRow(0);
    row.insertCell(0).innerText = plate;
    row.insertCell(1).innerText = details;
    row.insertCell(2).innerText = slot;
    row.insertCell(3).innerText = entry.toLocaleTimeString();
    row.insertCell(4).innerText = exit.toLocaleTimeString();
    row.insertCell(5).innerText = fee;
}

function openGate(id) {
    let gate = document.getElementById(id);
    gate.classList.add("open");
    setTimeout(() => gate.classList.remove("open"), 3000);
}

window.onload = function () {
    const saved = JSON.parse(localStorage.getItem("saved_parking_session") || "null");
    if (saved) {
        document.getElementById("loginUsername").value = saved.username;
        document.getElementById("loginPassword").value = saved.password;
    }

    let parking = document.getElementById("parking");
    parking.innerHTML = "";

    for (let i = 1; i <= totalSlots; i++) {
        let div = document.createElement("div");
        div.className = "slot available";
        div.innerHTML = `S${i}<span class="slot-tag">Free</span>`;
        div.dataset.slotId = "S" + i;
        div.dataset.status = "available";

        div.onclick = function() {
            if (div.dataset.status === "available") {
                manualBookSlot(div.dataset.slotId);
            } else {
                alert(`Slot ${div.dataset.slotId} is already occupied.`);
            }
        };

        parking.appendChild(div);
    }
    updateDashboard();
};

function updateDashboard() {
    let available = 0, occupied = 0;
    document.querySelectorAll(".slot").forEach(s => {
        if (s.dataset.status === "available") available++;
        else occupied++;
    });
    document.getElementById("available").innerText = available;
    document.getElementById("occupied").innerText = occupied;
}