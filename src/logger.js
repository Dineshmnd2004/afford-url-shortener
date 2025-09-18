export default function logEvent(eventName, payload = {}) {
  const logs = JSON.parse(localStorage.getItem("afford_logs") || "[]");
  logs.push({
    event: eventName,
    payload,
    time: new Date().toISOString(),
  });
  localStorage.setItem("afford_logs", JSON.stringify(logs));
}
