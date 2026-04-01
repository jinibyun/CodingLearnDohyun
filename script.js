const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const easternTimeElement = document.getElementById("eastern-time");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric"
});

const easternTimeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
});

function padNumber(value) {
    return String(value).padStart(2, "0");
}

function updateClock() {
    const now = new Date();

    const hours = padNumber(now.getHours());
    const minutes = padNumber(now.getMinutes());
    const seconds = padNumber(now.getSeconds());

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    dateElement.textContent = dateFormatter.format(now);
    easternTimeElement.textContent = `US Eastern Time • ${easternTimeFormatter.format(now)}`;
}

updateClock();
setInterval(updateClock, 1000);