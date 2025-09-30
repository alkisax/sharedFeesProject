"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_to_swagger_1 = __importDefault(require("mongoose-to-swagger"));
const users_models_1 = __importDefault(require("../login/models/users.models"));
const upload_model_1 = __importDefault(require("../uploadMulter/upload.model"));
const globalBill_model_1 = __importDefault(require("../bill/models/globalBill.model"));
const bill_model_1 = __importDefault(require("../bill/models/bill.model"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const swaggerBase = path_1.default.join(process.cwd(), "src/utils/swaggerRoutes");
const userRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'userRoutes.swagger.yml'));
const authRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'authRoutes.swagger.yml'));
const uploadMulterRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'uploadMulterRoutes.swagger.yml'));
const globalBillRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'globalBillRoutes.swagger.yml'));
const billRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'billRoutes.swagger.yml'));
const excelRoutesDocs = yamljs_1.default.load(path_1.default.join(swaggerBase, 'excelRoutes.swagger.yml'));
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            version: '1.0.0',
            title: 'User and Auth API',
            description: 'An application for managing users and authentication (JWT and Google login)',
        },
        components: {
            schemas: {
                User: (0, mongoose_to_swagger_1.default)(users_models_1.default),
                Multer: (0, mongoose_to_swagger_1.default)(upload_model_1.default),
                GlobalBill: (0, mongoose_to_swagger_1.default)(globalBill_model_1.default),
                Bill: (0, mongoose_to_swagger_1.default)(bill_model_1.default)
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }],
        paths: {
            ...authRoutesDocs.paths,
            ...userRoutesDocs.paths,
            // ...emailRoutesDocs.paths,
            ...uploadMulterRoutesDocs.paths,
            ...globalBillRoutesDocs.paths,
            ...billRoutesDocs.paths,
            ...excelRoutesDocs.paths,
        },
    },
    apis: []
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map