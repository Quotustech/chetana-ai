import { Router } from "express";
import { authCheck } from "../../../middleware/authMiddleware";
import {
  sendMessageToChatGPT,
  getChatByUser,
  getAllChat,
  getAllChatByChatGroup,
  getAllChatByOrgId,
  getAllChatByDeptId
} from "../../../controller/v1/chatController";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";

const router = Router();
const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin", "admin", "deptadmin" ,"user"]
};

router.route("/chat").post(authCheck(authorizedRoles),validateRouteRequest({ schema: routeValidatorSchemas.sendMessageToChatGPT }), sendMessageToChatGPT as any);
router.route("/allChat/:id").get(authCheck(authorizedRoles), getChatByUser);
router.route("/allChat").get(authCheck(authorizedRoles), getAllChat);
router.route('/allChat/organization/:orgId').get(authCheck(authorizedRoles),getAllChatByOrgId);
router.route('/allChat/department/:deptId').get(authCheck(authorizedRoles),getAllChatByDeptId);
router.route("/share/:groupId").get(authCheck(authorizedRoles) , getAllChatByChatGroup)

export default router;
