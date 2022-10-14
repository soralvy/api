import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategories } from '../site-page.model';

export class SitePageAdvantageDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}

export class vacanciesDataDto {
  @IsNumber()
  amount: number;
  @IsNumber()
  juniorSalary: number;
  @IsNumber()
  middleSalary: number;
  @IsNumber()
  seniorSalary: number;
}

export class CreateSitePageDto {
  @IsEnum(TopLevelCategories)
  firstCategory: TopLevelCategories;
  @IsString()
  secondCategory: string;
  @IsString()
  alias: string;
  @IsString()
  title: string;
  @IsString()
  category: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => vacanciesDataDto)
  vacancies?: vacanciesDataDto;
  @IsString({ each: true })
  @IsArray()
  @ValidateNested()
  @Type(() => SitePageAdvantageDto)
  advantages: SitePageAdvantageDto[];
  @IsString()
  seoText: string;
  @IsString()
  tagsTitle: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
