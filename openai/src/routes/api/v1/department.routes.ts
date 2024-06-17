import { Router } from "express";
import {
  approveUser,
  createDepartment,
  deleteDepartmentById,
  getAllDepartments,
  getDepartmentByEmail,
  getDepartmentsByOrganization,
  updateDepartmentById,
} from "../../../controller/v1/deptController";
import { authCheck } from "../../../middleware/authMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";

const router = Router();
const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin", "admin", "deptadmin"]
};

router
  .route("/department")
  .post(authCheck({roles:["superadmin", "admin"]}),validateRouteRequest({ schema: routeValidatorSchemas.createDepartment }), createDepartment)
  .get(authCheck({roles:["superadmin", "admin"]}), getAllDepartments);

router
  .route("/department/organization/:orgId")
  .get(getDepartmentsByOrganization);

router.route('/department/user/me').post(authCheck({roles:["deptadmin"]}) , validateRouteRequest({ schema: routeValidatorSchemas.getDepartmentByEmail }), getDepartmentByEmail)

router
  .route("/department/:id")
  .delete(authCheck({roles:["superadmin", "admin"]}), deleteDepartmentById)
  .put(authCheck({roles:["superadmin", "admin"]}), updateDepartmentById);

router.route("/department/userapprove").patch(authCheck({roles:["superadmin"]}),validateRouteRequest({ schema: routeValidatorSchemas.approveUser }), approveUser);

export default router;
