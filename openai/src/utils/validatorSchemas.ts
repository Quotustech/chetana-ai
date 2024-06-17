import Joi, { Schema } from 'joi';


interface ValidationSchemas {
    [key: string]: Schema;
}

export const routeValidatorSchemas:ValidationSchemas = {
    register: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        organization: Joi.string().required(),
        department: Joi.string().required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    forgetPassword: Joi.object({
        email: Joi.string().email().required(),
    }),
    resetPassword: Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().required()
    }),
    sendMessageToChatGPT: Joi.object({
        userId: Joi.string().optional(),
        message: Joi.string().required(),
        groupId: Joi.string().optional(),
        apiKeyName: Joi.string().required(),
        instruction: Joi.string().optional()
    }),
    getDepartmentByEmail: Joi.object({
        email: Joi.string().email().required()
    }),
    createDepartment: Joi.object({
        deptHeadName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        description: Joi.string().required(),
        name: Joi.string().required(),
        organization: Joi.string().required()
    }),
    getOrganizationByEmail: Joi.object({
        email: Joi.string().email().required()
    }),
    approveUser: Joi.object({
        userId: Joi.string().required(),
        deptId: Joi.string().required(),
        orgId: Joi.string().required()
    }),
    createOrganization: Joi.object({
        phoneNumber: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    createSuperAdmin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('superadmin').required(),
        name: Joi.string().required()
    }),
    getSuperAdminByEmail: Joi.object({
        email: Joi.string().email().required()
    }),
    approveDepartment: Joi.object({
        departmentId: Joi.string().required(),
        apiKey: Joi.string().required(),
        chatGptModel: Joi.string().required()
    }),
    createUser: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('user').required(),
        password: Joi.string().required()
    }),
    createJobRole : Joi.object({
        jobName: Joi.string().required(),
        description : Joi.string().required(),
    }),
    updateJobRole : Joi.object({
        jobName: Joi.string().regex(/^[a-zA-Z]+$/).optional(),
        description : Joi.string().optional(),
    }),
    createQuestion : Joi.object({
       question : Joi.string().required(),
       jobRoleId : Joi.string().required()
    })
}