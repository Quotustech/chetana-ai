import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import chatGroupRoutes from "./chatGroup.routes";
import organizationRoutes from "./organization.routes";
import userRoutes from "./user.routes";
import superadminRoutes from "./superAdmin.routes";
import deptRoutes from "./department.routes";
import interviewRoutes from "./interview.routes"
const router = Router();

router.use("/auth", authRoutes);
router.use("/", chatRoutes);
router.use("/", chatGroupRoutes);
router.use("/", organizationRoutes);
router.use("/", userRoutes);
router.use("/", superadminRoutes);
router.use("/", deptRoutes);
router.use("/", interviewRoutes)

export default router;
