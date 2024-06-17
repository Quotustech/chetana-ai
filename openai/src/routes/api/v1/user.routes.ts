import express, { Router , Request, Response} from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersbyOrganization,
  getUsersbyDepartment,
} from "../../../controller/v1/userController";
import { authCheck } from "../../../middleware/authMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";

const router: Router = express.Router();

const authorizedRoles:IAuthorizedRoles = {
  roles:["superadmin", "admin", "deptadmin" ,"user"]
};

router.post("/createuser", authCheck({roles:["superadmin"]}),validateRouteRequest({ schema: routeValidatorSchemas.createUser }), createUser);
router.put("/updateuser/:id", authCheck({roles:["user" , "deptadmin", "superadmin"]}), updateUser);
router.delete("/users/:id", authCheck({roles:["superadmin", "admin", "deptadmin"]}), deleteUser);
router.get("/users/:id", authCheck(authorizedRoles) , getUserById);
router.get("/users", authCheck({roles:["superadmin"]}), getAllUsers);
router.get("/users/organization/:orgId", authCheck({roles:["superadmin"]}), getUsersbyOrganization);
router.get("/users/department/:deptId", authCheck({roles:["superadmin" , "admin" , "deptadmin"]}), getUsersbyDepartment);

export default router;
