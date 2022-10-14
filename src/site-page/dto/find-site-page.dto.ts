import { IsEnum } from 'class-validator';
import { TopLevelCategories } from '../site-page.model';

export class FindSitePageDto {
  @IsEnum(TopLevelCategories)
  firstCategory: TopLevelCategories;
}
