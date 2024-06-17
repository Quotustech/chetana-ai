import { Router } from "express";
import { 
    createJobRole, 
    submitVideo , 
    getAllJobRoles, 
    getJobRoleById, 
    deleteJobRoleById,
    updateJobRole,
    createQuestion,
    getAllQuestionByJobId,
    deleteQuestionById
} from "../../../controller/v1/interviewController";
import { authCheck } from "../../../middleware/authMiddleware";
import { videoUploadMiddleware } from "../../../middleware/uploadMulterMiddleware";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import { routeValidatorSchemas } from "../../../utils/validatorSchemas";
import { validateRouteRequest } from "../../../middleware/routeRequestValidator";
import { checkValidMongoId } from "../../../middleware/checkValidMongoId";

const router = Router();

const authorizedRoles:IAuthorizedRoles = {
    roles:["superadmin", "admin", "deptadmin" ,"user"]
};

router
    .route("/interview")
    .post(authCheck(authorizedRoles), videoUploadMiddleware , submitVideo);

router
    .route("/interview/jobroles")
    .get(authCheck(authorizedRoles), getAllJobRoles)    

router
    .route("/interview/createjobrole")
    .post(authCheck({roles:["superadmin"]}), validateRouteRequest({schema: routeValidatorSchemas.createJobRole}), createJobRole)

router
    .route("/interview/jobrole/:id")
    .get(authCheck(authorizedRoles), checkValidMongoId, getJobRoleById)
    .delete(authCheck({roles:["superadmin"]}), checkValidMongoId,  deleteJobRoleById)   
    .put(authCheck({roles:["superadmin"]}), checkValidMongoId, updateJobRole) // not tested

router
    .route("/interview/jobrole/question/createquestion")
    .post(authCheck({roles:["superadmin"]}), validateRouteRequest({schema: routeValidatorSchemas.createQuestion}) ,createQuestion) // not tested

router
    .route("/interview/jobrole/question/getallquestion/:jobroleid")
    .get(authCheck(authorizedRoles), checkValidMongoId, getAllQuestionByJobId)  
  
router
    .route("/interview/jobrole/question/:id")
    .delete(authCheck({roles:["superadmin"]}), checkValidMongoId, deleteQuestionById)
    // .get(authCheck(authorizedRoles), checkValidMongoId,  )

export default router;