import m2s from 'mongoose-to-swagger';
import User from '../login/models/users.models';
import Upload from '../uploadMulter/upload.model';
import GlobalBill from '../bill/models/globalBill.model';
import Bill from '../bill/models/bill.model';
import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'yamljs';
import path from 'path';

const swaggerBase = path.join(process.cwd(), "src/utils/swaggerRoutes");

const userRoutesDocs = yaml.load(path.join(swaggerBase, 'userRoutes.swagger.yml'));
const authRoutesDocs = yaml.load(path.join(swaggerBase, 'authRoutes.swagger.yml'));
const uploadMulterRoutesDocs = yaml.load(path.join(swaggerBase, 'uploadMulterRoutes.swagger.yml'));
const globalBillRoutesDocs = yaml.load(path.join(swaggerBase, 'globalBillRoutes.swagger.yml'));
const billRoutesDocs = yaml.load(path.join(swaggerBase, 'billRoutes.swagger.yml'));
const excelRoutesDocs = yaml.load(path.join(swaggerBase, 'excelRoutes.swagger.yml'));


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
        User: m2s(User),
        Multer: m2s(Upload),
        GlobalBill: m2s(GlobalBill),
        Bill: m2s(Bill)
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

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
