import { Router } from "express";
import { requireAuth, requireVaultUnlock } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listVaultItems,
  searchVaultItems,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
  lockVault,
  createVaultItemSchema,
  updateVaultItemSchema,
} from "../controllers/vaultController";

const router = Router();

router.post("/lock", requireAuth, lockVault);

router.use(requireAuth, requireVaultUnlock);

router.get("/", listVaultItems);
router.get("/search", searchVaultItems);
router.post("/", validate(createVaultItemSchema), createVaultItem);
router.put("/:id", validate(updateVaultItemSchema), updateVaultItem);
router.delete("/:id", deleteVaultItem);

export default router;
