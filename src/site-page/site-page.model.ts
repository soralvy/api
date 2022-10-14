import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum TopLevelCategories {
  Courses,
  Services,
  Books,
  Products,
}

export class SitePageAdvantage {
  title: string;
  description: string;
}

export class vacanciesData {
  @prop()
  amount: number;
  @prop()
  juniorSalary: number;
  @prop()
  middleSalary: number;
  @prop()
  seniorSalary: number;
}

export interface SitePageModel extends Base {}

@index({ '$**': 'text' }) // for small and middle projects, for bigger projects better use elastic search
export class SitePageModel extends TimeStamps {
  @prop({ enum: TopLevelCategories })
  firstCategory: TopLevelCategories;
  @prop()
  secondCategory: string;
  @prop({ unique: true })
  alias: string;
  @prop()
  title: string;
  @prop()
  category: string;
  @prop({ type: () => vacanciesData })
  vacancies?: vacanciesData;
  @prop({ type: () => [SitePageAdvantage] })
  advantages: SitePageAdvantage[];
  @prop()
  seoText: string;
  @prop()
  tagsTitle: string;
  @prop({ type: () => [String] })
  tags: string[];
}
