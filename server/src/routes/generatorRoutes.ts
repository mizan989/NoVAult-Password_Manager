import { Router } from "express";
import { validate } from "../middleware/validate";
import { generatePasswordController, generatePasswordSchema } from "../controllers/generatorController";

const router = Router();

router.post("/", validate(generatePasswordSchema), generatePasswordController);

export default router;
