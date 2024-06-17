import { Router } from "express";
import {
  createGroup,
  getAllGroup,
  getUserGroups,
} from "../../../controller/v1/chatGroupController";
import { authCheck } from "../../../middleware/authMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";

const router = Router();
const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin", "admin", "deptadmin" ,"user"]
};

router
  .route("/chatGroup/:userId")
  .post(authCheck(authorizedRoles), createGroup)
  .get(authCheck(authorizedRoles), getUserGroups);
router.route("/allChatGroup").get(authCheck(authorizedRoles), getAllGroup);

export default router;
