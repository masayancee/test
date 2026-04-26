const currentTimeEl = document.getElementById('currentTime');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const setBtn = document.getElementById('setBtn');
const cancelBtn = document.getElementById('cancelBtn');
const statusEl = document.getElementById('alarmStatus');
const alarmSound = document.getElementById('alarmSound');

let alarmTime = null;
let alarmActive = false;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

    if (alarmActive && alarmTime) {
        if (hours === alarmTime.hours && minutes === alarmTime.minutes) {
            triggerAlarm();
        }
    }
}

function triggerAlarm() {
    alarmActive = false;
    statusEl.textContent = 'ALARM!!!';
    statusEl.classList.remove('active');
    statusEl.classList.add('ringing');
    setBtn.disabled = false;
    cancelBtn.disabled = true;

    playAlarmSound();
    setTimeout(() => {
        stopAlarm();
    }, 5000);
}

function playAlarmSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 5);

    oscillator.start(now);
    oscillator.stop(now + 5);
}

function stopAlarm() {
    statusEl.textContent = 'Alarm stopped';
    statusEl.classList.remove('ringing');
    statusEl.classList.add('active');
    setTimeout(() => {
        resetStatus();
    }, 2000);
}

function resetStatus() {
    alarmTime = null;
    alarmActive = false;
    statusEl.textContent = '';
    statusEl.classList.remove('active', 'ringing');
    statusEl.classList.add('empty');
    setBtn.disabled = false;
    cancelBtn.disabled = true;
}

setBtn.addEventListener('click', () => {
    const hours = String(hoursInput.value).padStart(2, '0');
    const minutes = String(minutesInput.value).padStart(2, '0');

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        alarmTime = { hours, minutes };
        alarmActive = true;
        statusEl.textContent = `Alarm set for ${hours}:${minutes}`;
        statusEl.classList.remove('empty');
        statusEl.classList.add('active');
        setBtn.disabled = true;
        cancelBtn.disabled = false;
    } else {
        alert('Please enter a valid time');
    }
});

cancelBtn.addEventListener('click', () => {
    resetStatus();
    statusEl.textContent = 'Alarm cancelled';
    statusEl.classList.add('active');
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.classList.remove('active');
    }, 2000);
});

setInterval(updateClock, 1000);
updateClock();
