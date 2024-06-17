import express, { Router } from "express";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationByEmail,
  getOrganizationId,
} from "../../../controller/v1/organizationController";
import { authCheck } from "../../../middleware/authMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";

const router: Router = express.Router();

const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin"]
};

router
  .route("/organization")
  .post(authCheck(authorizedRoles),validateRouteRequest({ schema: routeValidatorSchemas.createOrganization }), createOrganization)
  .get( getAllOrganizations);
router.route('/organization/user/me').post(authCheck({roles:["admin"]}) ,validateRouteRequest({ schema: routeValidatorSchemas.getOrganizationByEmail }), getOrganizationByEmail)
router
  .route("/organization/:id")
  .get(authCheck(authorizedRoles), getOrganizationId)
  .delete(authCheck(authorizedRoles), deleteOrganization);

export default router;
