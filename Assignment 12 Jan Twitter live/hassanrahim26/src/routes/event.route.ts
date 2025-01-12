import express from "express";
import {
  getEventBySlug,
  searchEvents,
  softDeleteEvent,
  updateEventDescription,
} from "../controllers/event.controller";

const router = express.Router();

router.get("/:slug", getEventBySlug);
router.get("/", searchEvents);
router.delete("/:slug", softDeleteEvent);
router.put("/:slug/description", updateEventDescription);

export default router;
