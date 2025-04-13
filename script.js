let businessTasks = JSON.parse(localStorage.getItem("businessTasks")) || [];
let educationalTasks = JSON.parse(localStorage.getItem("educationalTasks")) || [];
let specialTasks = JSON.parse(localStorage.getItem("specialTasks")) || [];
let newYearTasks = JSON.parse(localStorage.getItem("newYearTasks")) || [];
let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
let customSoundFile = null;
let customRingtoneFile = null;
let soundEnabled = true;
let messagesEnabled = true;
let selectedLanguage = "en";

const taskForm = document.getElementById("taskForm");
const businessList = document.getElementById("businessList");
const educationalList = document.getElementById("educationalList");
const specialList = document.getElementById("specialList");
const newYearList = document.getElementById("newYearList");
const notificationBar = document.getElementById("notificationBar");
const notificationMessage = document.getElementById("notificationMessage");
const newYearNotif = document.getElementById("newYearNotif");
const newYearMessage = document.getElementById("newYearMessage");
const notificationSound = document.getElementById("notificationSound");
const ringtoneSound = document.getElementById("ringtoneSound");
const clickSound = document.getElementById("clickSound");
const chimeSound = document.getElementById("chimeSound");
const popSound = document.getElementById("popSound");
const beepSound = document.getElementById("beepSound");
const triumphSound = document.getElementById("triumphSound");
const firecrackerSound = document.getElementById("firecrackerSound");
const newYearSong = document.getElementById("newYearSong");
const rabanSound = document.getElementById("rabanSound");
const notificationSoundSelect = document.getElementById("notificationSoundSelect");
const customSoundInput = document.getElementById("customSound");
const ringtoneSection = document.getElementById("ringtoneSection");
const ringtoneSoundSelect = document.getElementById("ringtoneSoundSelect");
const customRingtoneInput = document.getElementById("customRingtone");
const showOnHomepage = document.getElementById("showOnHomepage");
const ringtoneEnabled = document.getElementById("ringtoneEnabled");
const notificationList = document.getElementById("notificationList");
const notificationCount = document.getElementById("notificationCount");
const soundToggle = document.getElementById("soundToggle");
const messageToggle = document.getElementById("messageToggle");
const completionOverlay = document.getElementById("completionOverlay");
const warningOverlay = document.getElementById("warningOverlay");
const warningMessage = document.getElementById("warningMessage");
const themeIcon = document.getElementById("themeIcon");
const languageSelect = document.getElementById("languageSelect");
const nakathList = document.getElementById("nakathList");
const nakathButton = document.getElementById("nakathButton");

let taskTimers = new Map();

const nakathData = [
    {
        id: 1,
        ritual: "Nonagathaya",
        date: "2025-04-13",
        time: "20:57",
        direction: "Facing East",
        action: "Cease all activities.",
        si: { ritual: "නොනගතය", action: "සියලු කටයුතු නවත්වන්න." },
        ta: { ritual: "நோனகதய", action: "அனைத்து செயல்களையும் நிறுத்தவும்." }
    },
    {
        id: 2,
        ritual: "Food Preparation",
        date: "2025-04-14",
        time: "04:04",
        direction: "Facing South",
        action: "Prepare traditional meals.",
        si: { ritual: "ආහාර පිසීම", action: "සාම්ප්‍රදායික ආහාර පිළියෙල කරන්න." },
        ta: { ritual: "உணவு தயாரிப்பு", action: "பாரம்பரிய உணவுகளை தயார் செய்யவும்." }
    },
    {
        id: 3,
        ritual: "Work Commencement, Transactions, and Meal",
        date: "2025-04-14",
        time: "06:14",
        direction: "Facing East",
        action: "Start work, conduct transactions, and eat.",
        si: { ritual: "වැඩ ඇල්ලීම, ගනුදෙනු කිරීම හා ආහාර අනුභවය", action: "වැඩ ආරම්භ කරන්න, ගනුදෙනු කරන්න, ආහාර ගන්න." },
        ta: { ritual: "வேலை ஆரம்பம், பரிவர்த்தனைகள் மற்றும் உணவு", action: "வேலையை தொடங்கவும், பரிவர்த்தனைகள் செய்யவும், உணவு உண்ணவும்." }
    },
    {
        id: 4,
        ritual: "Anointing Oil",
        date: "2025-04-16",
        time: "09:04",
        direction: "Facing South",
        action: "Apply oil on the head.",
        si: { ritual: "හිස තෙල් ගෑම", action: "හිසට තෙල් ගල්වන්න." },
        ta: { ritual: "தலை எண்ணெய் தேய்ப்பு", action: "தலையில் எண்ணெய் தடவவும்." }
    },
    {
        id: 5,
        ritual: "Departure for Work",
        date: "2025-04-17",
        time: "09:03",
        direction: "Facing East",
        action: "Leave for work or business.",
        si: { ritual: "රැකි රක්ෂා සඳහා පිටත් වීම", action: "වැඩ හෝ ව්‍යාපාර සඳහා පිටත් වන්න." },
        ta: { ritual: "வேலைக்கு புறப்படுதல்", action: "வேலை அல்லது வணிகத்திற்கு புறப்படவும்." }
    }
];

// Initialize audio elements to ensure they’re ready for playback
function initializeAudio() {
    const sounds = [
        notificationSound,
        ringtoneSound,
        clickSound,
        chimeSound,
        popSound,
        beepSound,
        triumphSound,
        firecrackerSound,
        newYearSong,
        rabanSound
    ];
    sounds.forEach(sound => {
        sound.volume = 0.8; // Set default volume
        sound.load(); // Preload audio
    });
}

function checkNewYearDecoration() {
    const today = new Date();
    const expiryDate = new Date("2025-04-30");
    if (today > expiryDate) {
        const decoration = document.querySelector(".new-year-decoration");
        decoration.style.setProperty("--before-display", "none");
        decoration.style.setProperty("--after-display", "none");
    } else {
        const sparkles = document.createElement("div");
        sparkles.innerHTML = '<span class="sparkle"></span><span class="sparkle"></span><span class="sparkle"></span>';
        document.querySelector(".new-year-decoration").appendChild(sparkles);
    }
}

function closeNotification() {
    notificationBar.style.display = "none";
}

function closeNewYearNotif() {
    newYearNotif.style.display = "none";
}

function closeCompletionOverlay() {
    completionOverlay.style.display = "none";
}

function playSound(soundElement, errorMessage) {
    if (!soundEnabled) return;
    try {
        soundElement.currentTime = 0; // Reset to start
        soundElement.volume = 0.8; // Ensure consistent volume
        soundElement.play().catch(() => {
            console.log(errorMessage);
            // Fallback to default sound if custom fails
            if (soundElement !== notificationSound) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(() => console.log("Default sound failed"));
            }
        });
    } catch (error) {
        console.log(errorMessage, error);
    }
}

function saveTasks() {
    localStorage.setItem("businessTasks", JSON.stringify(businessTasks));
    localStorage.setItem("educationalTasks", JSON.stringify(educationalTasks));
    localStorage.setItem("specialTasks", JSON.stringify(specialTasks));
    localStorage.setItem("newYearTasks", JSON.stringify(newYearTasks));
}

function saveNotifications() {
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

function renderTasks() {
    businessList.innerHTML = "";
    educationalList.innerHTML = "";
    specialList.innerHTML = "";
    newYearList.innerHTML = "";
    businessTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.name} - ${task.date || "No Date"} ${task.time || ""}
            <button onclick="deleteTask('business', ${index})">Delete</button>
            <button class="complete" onclick="completeTask('business', ${index})">Complete</button>`;
        businessList.appendChild(li);
    });
    educationalTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.name} - ${task.date || "No Date"} ${task.time || ""}
            <button onclick="deleteTask('educational', ${index})">Delete</button>
            <button class="complete" onclick="completeTask('educational', ${index})">Complete</button>`;
        educationalList.appendChild(li);
    });
    specialTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.name} - ${task.date || "No Date"} ${task.time || ""}
            <button onclick="deleteTask('special', ${index})">Delete</button>
            <button class="complete" onclick="completeTask('special', ${index})">Complete</button>`;
        specialList.appendChild(li);
    });
    newYearTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.name} - ${task.date || "No Date"} ${task.time || ""}
            <button onclick="deleteTask('newYear', ${index})">Delete</button>
            <button class="complete" onclick="completeTask('newYear', ${index})">Complete</button>`;
        newYearList.appendChild(li);
    });
}

function deleteNotification(index) {
    notifications.splice(index, 1);
    saveNotifications();
    renderNotifications();
}

function renderNotifications() {
    notificationList.innerHTML = "";
    notifications.forEach(notif => { notif.seen = true; });
    notificationCount.textContent = "0";
    notifications.forEach((notif, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${notif.message} <button onclick="deleteNotification(${index})">Delete</button>`;
        notificationList.appendChild(li);
    });
    saveNotifications();
}

function deleteTask(category, index) {
    const taskId = `${category}-${index}`;
    clearTaskTimers(taskId);
    if (category === "business") businessTasks.splice(index, 1);
    else if (category === "educational") educationalTasks.splice(index, 1);
    else if (category === "special") specialTasks.splice(index, 1);
    else if (category === "newYear") newYearTasks.splice(index, 1);
    saveTasks();
    renderTasks();
    if (soundEnabled) playSound(popSound, "Pop sound failed");
}

function completeTask(category, index) {
    const taskId = `${category}-${index}`;
    clearTaskTimers(taskId);
    const task = category === "business" ? businessTasks[index] :
                category === "educational" ? educationalTasks[index] :
                category === "special" ? specialTasks[index] :
                newYearTasks[index];
    if (messagesEnabled) {
        const message = `Congratulations! Your task "${task.name}" has been completed! ☺`;
        notifications.push({ message, seen: false, timestamp: new Date() });
        saveNotifications();
        updateNotificationCount();
        showSystemNotification(message, "Task Completed");
        completionOverlay.style.display = "flex";
        document.getElementById("completionText").textContent = message;
        if (soundEnabled) playSound(triumphSound, "Triumph sound failed");
        setTimeout(closeCompletionOverlay, 5000);
    }
    if (category === "business") businessTasks.splice(index, 1);
    else if (category === "educational") educationalTasks.splice(index, 1);
    else if (category === "special") specialTasks.splice(index, 1);
    else if (category === "newYear") newYearTasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function updateNotificationCount() {
    const unseenCount = notifications.filter(n => !n.seen).length;
    notificationCount.textContent = unseenCount;
}

function clearTaskTimers(taskId) {
    const timers = taskTimers.get(taskId) || [];
    timers.forEach(timer => clearTimeout(timer));
    taskTimers.delete(taskId);
}

function showNotification(message, isRingtone = false, taskId = null) {
    if (!messagesEnabled && !isRingtone) return;
    const displayMessage = isRingtone ? message : `Don't forget there 😊: ${message}`;
    if (messagesEnabled) {
        notificationMessage.textContent = displayMessage;
        if (showOnHomepage.checked) {
            notificationBar.style.display = "flex";
        }
        notifications.push({ message: displayMessage, seen: false, timestamp: new Date() });
        saveNotifications();
        updateNotificationCount();
        showSystemNotification(displayMessage, isRingtone ? "High Warning" : "Task Reminder");
    }
    if (soundEnabled) {
        const sound = isRingtone ? ringtoneSound : notificationSound;
        playSound(sound, isRingtone ? "Ringtone sound failed" : "Notification sound failed");
    }
    if (isRingtone && messagesEnabled) {
        warningMessage.textContent = message;
        warningOverlay.style.display = "flex";
        setTimeout(() => warningOverlay.style.display = "none", 3000);
    }
}

function showSystemNotification(message, title) {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: message, icon: "icon.png" });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message, icon: "icon.png" });
                }
            });
        }
    }
}

function scheduleReminders(task, category, index) {
    if (!task.date) return;
    const taskId = `${category}-${index}`;
    const timers = [];
    const taskDate = new Date(`${task.date}T${task.time || "00:00"}`);
    const now = new Date();
    const daysBefore = new Date(taskDate);
    daysBefore.setDate(taskDate.getDate() - (task.daysBefore || 0));
    const customWarning = new Date(taskDate);
    customWarning.setHours(taskDate.getHours() - task.warningHours);
    const threeHoursBefore = new Date(taskDate);
    threeHoursBefore.setHours(taskDate.getHours() - 3);
    if (task.sound === "custom" && customSoundFile) {
        try {
            notificationSound.src = URL.createObjectURL(customSoundFile);
        } catch (error) {
            console.log("Custom sound error:", error);
            notificationSound.src = "default.mp3";
        }
    }
    let timeToReminder = daysBefore - now;
    if (timeToReminder > 0) {
        const timer = setTimeout(() => {
            showNotification(`Reminder: "${task.name}" in ${category} is due in ${task.daysBefore} days!`, false, taskId);
            if (task.repeatInterval > 0) {
                const interval = setInterval(() => {
                    showNotification(`Reminder: "${task.name}" in ${category} is still pending!`, false, taskId);
                }, task.repeatInterval * 60 * 1000);
                timers.push(interval);
                setTimeout(() => clearInterval(interval), task.repeatInterval * 60 * 1000 * 5);
            }
        }, timeToReminder);
        timers.push(timer);
    }
    timeToReminder = customWarning - now;
    if (timeToReminder > 0 && ringtoneEnabled.checked) {
        if (ringtoneSoundSelect.value === "custom" && customRingtoneFile) {
            try {
                ringtoneSound.src = URL.createObjectURL(customRingtoneFile);
            } catch (error) {
                console.log("Custom ringtone error:", error);
                ringtoneSound.src = "siren.mp3";
            }
        }
        const timer = setTimeout(() => {
            showNotification(`Warning: "${task.name}" in ${category} is due in ${task.warningHours} hours!`, true, taskId);
        }, timeToReminder);
        timers.push(timer);
    }
    if (ringtoneEnabled.checked) {
        timeToReminder = threeHoursBefore - now;
        if (timeToReminder > 0) {
            if (ringtoneSoundSelect.value === "custom" && customRingtoneFile) {
                try {
                    ringtoneSound.src = URL.createObjectURL(customRingtoneFile);
                } catch (error) {
                    console.log("Custom ringtone error:", error);
                    ringtoneSound.src = "siren.mp3";
                }
            }
            const timer = setTimeout(() => {
                showNotification(`Warning: "${task.name}" in ${category} is due in 3 hours!`, true, taskId);
                const interval = setInterval(() => {
                    showNotification(`Quick start your work: "${task.name}". If not, it will be lost to you 😥`, true, taskId);
                }, 60 * 60 * 1000);
                timers.push(interval);
            }, timeToReminder);
            timers.push(timer);
        }
    }
    taskTimers.set(taskId, timers);
}

function scheduleNakathNotifications() {
    nakathData.forEach((nakath, index) => {
        const nakathDateTime = new Date(`${nakath.date}T${nakath.time}:00+05:30`);
        const now = new Date();
        const timeToNakath = nakathDateTime - now;
        if (timeToNakath > 0) {
            const timer = setTimeout(() => {
                triggerNakathNotification(nakath);
            }, timeToNakath);
            taskTimers.set(`nakath-${index}`, [timer]);
        }
    });
}

function triggerNakathNotification(nakath) {
    if (!messagesEnabled) return;
    const message = nakath[selectedLanguage]?.action || nakath.action;
    const ritual = nakath[selectedLanguage]?.ritual || nakath.ritual;
    if (soundEnabled) {
        playSound(firecrackerSound, "Firecracker sound failed");
        setTimeout(() => {
            playSound(newYearSong, "New Year song failed");
            setTimeout(() => {
                playSound(rabanSound, "Raban sound failed");
                showNotification(`${ritual}: ${message}`, false, `nakath-${nakath.id}`);
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = selectedLanguage === "si" ? "si-LK" : selectedLanguage === "ta" ? "ta-IN" : "en-US";
                utterance.volume = 1;
                speechSynthesis.speak(utterance);
                newYearSong.volume = 0.3;
                playSound(newYearSong, "Background song failed");
                setTimeout(() => newYearSong.volume = 0.8, 15000);
            }, 10000);
        }, 15000);
    } else {
        showNotification(`${ritual}: ${message}`, false, `nakath-${nakath.id}`);
    }
}

function renderNakathList() {
    nakathList.innerHTML = "";
    nakathData.forEach(nakath => {
        const li = document.createElement("li");
        const ritual = nakath[selectedLanguage]?.ritual || nakath.ritual;
        const action = nakath[selectedLanguage]?.action || nakath.action;
        li.textContent = `${nakath.date} ${nakath.time} - ${ritual}: ${action} (${nakath.direction})`;
        nakathList.appendChild(li);
    });
}

function checkReminders() {
    [businessTasks, educationalTasks, specialTasks, newYearTasks].forEach((tasks, idx) => {
        const category = idx === 0 ? "business" : idx === 1 ? "educational" : idx === 2 ? "special" : "newYear";
        tasks.forEach((task, index) => scheduleReminders(task, category, index));
    });
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.getElementById("taskName").value;
    const taskCategory = document.getElementById("taskCategory").value;
    const taskDate = document.getElementById("taskDate").value;
    const taskTime = document.getElementById("taskTime").value;
    const daysBefore = parseInt(document.getElementById("daysBefore").value) || 0;
    const repeatInterval = parseInt(document.getElementById("repeatInterval").value) || 0;
    const warningHours = parseInt(document.getElementById("warningHours").value) || 3;
    const sound = notificationSoundSelect.value === "custom" && customSoundFile ? "custom" : "default";
    if (!taskName || !taskCategory || !warningHours) {
        showNotification("Please fill all required fields.");
        return;
    }
    const task = { name: taskName, date: taskDate, time: taskTime, daysBefore, repeatInterval, sound, warningHours };
    let index;
    if (taskCategory === "business") {
        businessTasks.push(task);
        index = businessTasks.length - 1;
    } else if (taskCategory === "educational") {
        educationalTasks.push(task);
        index = educationalTasks.length - 1;
    } else if (taskCategory === "special") {
        specialTasks.push(task);
        index = specialTasks.length - 1;
    }
    saveTasks();
    renderTasks();
    showNotification(`Task "${taskName}" added to ${taskCategory}!`);
    taskForm.reset();
    customSoundInput.style.display = "none";
    if (soundEnabled) playSound(clickSound, "Click sound failed");
    if (taskDate) {
        scheduleReminders(task, taskCategory, index);
    }
});

notificationSoundSelect.addEventListener("change", (e) => {
    customSoundInput.style.display = e.target.value === "custom" ? "block" : "none";
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

customSoundInput.addEventListener("change", (e) => {
    customSoundFile = e.target.files[0];
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

ringtoneSoundSelect.addEventListener("change", (e) => {
    customRingtoneInput.style.display = e.target.value === "custom" ? "block" : "none";
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

customRingtoneInput.addEventListener("change", (e) => {
    customRingtoneFile = e.target.files[0];
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
    soundToggle.classList.toggle("off", !soundEnabled);
});

messageToggle.addEventListener("click", () => {
    messagesEnabled = !messagesEnabled;
    messageToggle.textContent = `Messages: ${messagesEnabled ? "On" : "Off"}`;
    messageToggle.classList.toggle("off", !messagesEnabled);
});

ringtoneEnabled.addEventListener("change", () => {
    // No sound for toggling checkbox
});

showOnHomepage.addEventListener("change", () => {
    // No sound for toggling checkbox
});

newYearNotif.addEventListener("click", () => {
    showPanel("newYear");
    newYearNotif.style.display = "none";
});

nakathButton.addEventListener("click", () => {
    newYearNotif.style.display = "flex";
    scheduleNakathNotifications();
    nakathData.forEach(nakath => {
        const task = {
            name: nakath[selectedLanguage]?.ritual || nakath.ritual,
            date: nakath.date,
            time: nakath.time,
            daysBefore: 0,
            repeatInterval: 0,
            sound: "default",
            warningHours: 3
        };
        newYearTasks.push(task);
    });
    saveTasks();
    renderTasks();
    showNotification("Sinhala-Tamil New Year rituals activated!");
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

languageSelect.addEventListener("change", (e) => {
    selectedLanguage = e.target.value;
    renderNakathList();
    const messages = {
        en: "Nakath times activated! Keep data on for ritual notifications with sounds.",
        si: "නැකැත් වේලාවන් සක්‍රීයයි! චාරිත්‍ර දැනුම්දීම් සඳහා දත්ත රඳවා තබන්න.",
        ta: "நக்ஷத்திர நேரங்கள் செயல்படுத்தப்பட்டன! சடங்கு அறிவிப்புகளுக்கு தரவு இயக்கத்தில் இருக்க வேண்டும்."
    };
    showNotification(messages[selectedLanguage]);
    if (soundEnabled) playSound(chimeSound, "Chime sound failed");
});

function toggleRingtoneSection() {
    ringtoneSection.style.display = ringtoneEnabled.checked ? "block" : "none";
}

function showPanel(panelId) {
    document.querySelectorAll(".panel").forEach(panel => panel.classList.remove("active"));
    document.getElementById(panelId).classList.add("active");
    if (panelId === "notifications") {
        renderNotifications();
    } else if (panelId === "newYear") {
        renderNakathList();
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    themeIcon.classList.toggle("off");
    themeIcon.textContent = document.body.classList.contains("dark-theme") ? "💡" : "💡";
}

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("Please allow notifications for the best experience.");
            }
        });
    }
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(error => console.log("Service Worker Error:", error));
}

function initializeSettings() {
    ringtoneEnabled.checked = true;
    showOnHomepage.checked = true;
    toggleRingtoneSection();
    requestNotificationPermission();
    updateNotificationCount();
    initializeAudio(); // Initialize audio on load
}

renderTasks();
renderNotifications();
checkReminders();
checkNewYearDecoration();
initializeSettings();
