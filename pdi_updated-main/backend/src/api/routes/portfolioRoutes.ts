import { Router } from "express";
import { protect } from "../middlewares/auth";
import * as PortfolioController from "../controllers/portfolioController";

const router = Router();

router.use(protect);

// Portfolio Summary & Timeline
router.get("/:teacherId/summary", PortfolioController.getPortfolioSummary);
router.get("/:teacherId/timeline", PortfolioController.getPortfolioTimeline);

// Achievements CRUD
router.get("/:teacherId/achievements", PortfolioController.getAchievements);
router.post("/:teacherId/achievements", PortfolioController.createAchievement);
router.put("/:teacherId/achievements/:id", PortfolioController.updateAchievement);
router.delete("/:teacherId/achievements/:id", PortfolioController.deleteAchievement);

export default router;
