import { Router } from "express";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  register,
  verifyOtp,
  login,
  googleAuth,
  logout,
  refresh,
  me,
  updateName,
  createMasterPassword,
  verifyMasterPasswordController,
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  googleAuthSchema,
  masterPasswordSchema,
  verifyMasterPasswordSchema,
  updateNameSchema,
} from "../controllers/authController";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/google", authLimiter, validate(googleAuthSchema), googleAuth);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);
router.put("/me", requireAuth, validate(updateNameSchema), updateName);

router.post(
  "/master-password",
  requireAuth,
  validate(masterPasswordSchema),
  createMasterPassword
);
router.post(
  "/master-password/verify",
  requireAuth,
  validate(verifyMasterPasswordSchema),
  verifyMasterPasswordController
);

export default router;
