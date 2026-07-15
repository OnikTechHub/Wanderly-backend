const express = require("express");
const { v4: uuid } = require("uuid");
const { getTours, getTourById, addTour, deleteTour } = require("../utils/db");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ tours: getTours() });
});

router.get("/:id", (req, res) => {
  const tour = getTourById(req.params.id);
  if (!tour) return res.status(404).json({ error: "Tour not found." });
  res.json({ tour });
});

router.post("/", requireAuth, (req, res) => {
  const {
    title, shortDescription, fullDescription, price, date,
    location, category, duration, groupSize, imageUrl,
  } = req.body;

  if (!title || !shortDescription || !fullDescription || !price || !date || !location || !category) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  const tour = {
    id: `t-${uuid()}`,
    title,
    shortDescription,
    fullDescription,
    price: Number(price),
    date,
    rating: 0,
    location,
    category,
    duration: duration || "Flexible",
    groupSize: groupSize || "Contact for details",
    images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"],
    highlights: [],
    itinerary: [],
    createdBy: req.user.userId,
    createdAt: new Date().toISOString(),
  };

  addTour(tour);
  res.status(201).json({ tour });
});

router.delete("/:id", requireAuth, (req, res) => {
  const ok = deleteTour(req.params.id);
  if (!ok) return res.status(404).json({ error: "Tour not found." });
  res.json({ ok: true });
});

module.exports = router;
