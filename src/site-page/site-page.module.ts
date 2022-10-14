import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SitePageController } from './site-page.controller';
import { SitePageModel } from './site-page.model';
import { SitePageService } from './site-page.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SitePageModel,
        schemaOptions: {
          collection: 'SitePage',
        },
      },
    ]),
  ],
  controllers: [SitePageController],
  providers: [SitePageService],
})
export class SitePageModule {}
