import { Router } from "express";
import { protect } from "../middlewares/auth";
import * as IntegrationController from "../controllers/integrationController";

const router = Router();

router.use(protect);

router.get("/search", IntegrationController.globalSearch);
router.get("/metadata", IntegrationController.getMetadata);

export default router;
