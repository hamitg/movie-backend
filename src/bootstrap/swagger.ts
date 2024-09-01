import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import {
  SWAGGER_API_ROOT,
  SWAGGER_API_NAME,
  SWAGGER_API_DESCRIPTION,
} from '../common/constants/swagger.constants';

export default (app: INestApplication): void => {
  const swaggerBuilder = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerBuilder);

  SwaggerModule.setup(SWAGGER_API_ROOT, app, document, {
    explorer: false,
    customSiteTitle: 'MOVIE BACKEND API',
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      operationsSorter: 'alpha',
    },
  });
};
