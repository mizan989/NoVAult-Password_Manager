import { Router } from "express";
import { validate } from "../middleware/validate";
import { generatorLimiter } from "../middleware/rateLimiter";
import { generatePasswordController, generatePasswordSchema } from "../controllers/generatorController";

const router = Router();

router.post("/", generatorLimiter, validate(generatePasswordSchema), generatePasswordController);

export default router;
