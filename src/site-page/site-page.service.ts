import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateSitePageDto } from './dto/create-site-page-dto';
import { SitePageModel, TopLevelCategories } from './site-page.model';

@Injectable()
export class SitePageService {
  constructor(
    @InjectModel(SitePageModel)
    private readonly pageRepository: ModelType<SitePageModel>,
  ) {}
  async create(dto: CreateSitePageDto) {
    return this.pageRepository.create(dto);
  }

  async find(id: string) {
    return this.pageRepository.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.pageRepository.findOne({ alias }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategories) {
    return this.pageRepository
      .aggregate()
      .match({ firstCategory })
      .group({
        _id: { secondCategory: '$secondCategory' },
        page: { $push: { alias: '$alias', title: '$title' } },
      })
      .exec(); // group, push methods mongo
  }

  async findByText(text: string) {
    return this.pageRepository.find({
      $text: { $search: text, $caseSensitive: false },
    });
  }

  async delete(id: string) {
    return this.pageRepository.findByIdAndDelete(id).exec();
  }

  async update(id: string, dto: CreateSitePageDto) {
    return this.pageRepository.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
