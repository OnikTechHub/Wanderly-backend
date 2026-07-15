const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const TOURS_FILE = path.join(DATA_DIR, "tours.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function readJson(file) {
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw);
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

function getTours() {
  return readJson(TOURS_FILE);
}

function getTourById(id) {
  return getTours().find((t) => t.id === id);
}

function addTour(tour) {
  const tours = getTours();
  tours.unshift(tour);
  writeJson(TOURS_FILE, tours);
  return tour;
}

function deleteTour(id) {
  const tours = getTours();
  const next = tours.filter((t) => t.id !== id);
  const changed = next.length !== tours.length;
  if (changed) writeJson(TOURS_FILE, next);
  return changed;
}

function getUsers() {
  return readJson(USERS_FILE);
}

function getUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  writeJson(USERS_FILE, users);
  return user;
}

module.exports = {
  getTours,
  getTourById,
  addTour,
  deleteTour,
  getUsers,
  getUserByEmail,
  addUser,
};
