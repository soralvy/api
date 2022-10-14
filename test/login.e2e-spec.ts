import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  email: 'test@gmail.com',
  password: 'j',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail, wrong password', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'blalblala' })
      .expect(401, {
        statusCode: 401,
        message: 'Wrong password. Try again',
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail, wrong email', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, email: 'aorjaojr@gmaisfjiajf.com' })
      .expect(401, {
        statusCode: 401,
        message:
          "Couldn't find account associated with this email. Please try again.",
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
