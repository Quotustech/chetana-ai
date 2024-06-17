import { Router } from "express";

import {
  Login,
  Register,
  forgetPassword,
  resetPassword,
} from "../../../controller/v1/authController";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";
const router = Router();

router.route("/register").post(validateRouteRequest({ schema: routeValidatorSchemas.register }),Register);
router.route("/login").post(validateRouteRequest({ schema: routeValidatorSchemas.login }),Login);
router.route("/forgot-password").post(validateRouteRequest({ schema: routeValidatorSchemas.forgetPassword }),forgetPassword);
router.route("/reset-password/:token").post(validateRouteRequest({ schema: routeValidatorSchemas.resetPassword }),resetPassword);

export default router;
