
import logEvent from "./logger";

const DB_KEY = "afford_short_db";


export function loadDB() {
  return JSON.parse(localStorage.getItem(DB_KEY) || "{}");
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function existsCode(code) {
  const db = loadDB();
  return Object.prototype.hasOwnProperty.call(db, code);
}

export function addShort(code, record) {
  const db = loadDB();
  if (db[code]) return false;
  db[code] = { ...record, clicks: [] };
  saveDB(db);
  logEvent("short_created", { code, record });
  return true;
}

export function addClick(code, click) {
  const db = loadDB();
  if (!db[code]) return false;
  db[code].clicks = db[code].clicks || [];
  db[code].clicks.push(click);
  saveDB(db);
  logEvent("click_recorded", { code, click });
  return true;
}
