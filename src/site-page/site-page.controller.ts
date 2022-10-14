import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateSitePageDto } from './dto/create-site-page-dto';
import { FindSitePageDto } from './dto/find-site-page.dto';
import { PAGE_NOT_FOUND_ERROR } from './site-page.constants';
import { SitePageService } from './site-page.service';

@Controller('site-page')
export class SitePageController {
  constructor(private readonly sitepageService: SitePageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateSitePageDto) {
    return this.sitepageService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() { firstCategory }: FindSitePageDto) {
    return this.sitepageService.findByCategory(firstCategory);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.sitepageService.find(id);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return page;
  }

  @Get('byAlias/:alias')
  async getPageByAlias(@Param('alias') alias: string) {
    const page = await this.sitepageService.findByAlias(alias);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return page;
  }

  @Get('textSearch/:text')
  async getPageByText(@Param('text') text: string) {
    const page = await this.sitepageService.findByText(text);
    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id') id: string, dto: CreateSitePageDto) {
    const updatedPage = await this.sitepageService.update(id, dto);
    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
    return updatedPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedPage = await this.sitepageService.delete(id);
    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }
  }
}
