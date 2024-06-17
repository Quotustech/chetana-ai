import express, { Router } from "express";
import {
  approveDepartment,
  createSuperAdmin,
  deleteSuperAdmin,
  getPendingDepartments,
  getSuperAdminByEmail,
  getSuperAdminById,
  updateSuperAdmin,
} from "../../../controller/v1/superAdminController";
import { authCheck } from "../../../middleware/authMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";

const router: Router = express.Router();

const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin"]
};

router.route("/techmate").post(authCheck(authorizedRoles),validateRouteRequest({ schema: routeValidatorSchemas.createSuperAdmin }), createSuperAdmin);
router
  .route("/techmate/:id")
  .get(authCheck(authorizedRoles) , getSuperAdminById)
  .delete(authCheck(authorizedRoles) , deleteSuperAdmin)
  .put(authCheck(authorizedRoles) , updateSuperAdmin);
router.route("/techmate/user/me").post(authCheck(authorizedRoles), validateRouteRequest({ schema: routeValidatorSchemas.getSuperAdminByEmail }) , getSuperAdminByEmail)
router.route("/deptapprove").put(authCheck(authorizedRoles) ,validateRouteRequest({ schema: routeValidatorSchemas.approveDepartment }), approveDepartment);
router.route("/pendingdepartment").get(authCheck(authorizedRoles) , getPendingDepartments);

export default router;
