import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async createReview(@Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notifyAboutNewReview(@Body() dto: CreateReviewDto) {
    const message =
      `Author: ${dto.author}\n` +
      `Description: ${dto.description}\n` +
      `productId: ${dto.productId}\n` +
      `rating: ${dto.rating}\n` +
      `title: ${dto.title}`;
    return this.telegramService.sendMessage(message);
  }

  @Delete(':id')
  async deleteReview(@Param('id', IdValidationPipe) id: string) {
    const deletedDocument = await this.reviewService.deleteReview(id);
    if (!deletedDocument) {
      throw new HttpException(REVIEW_NOT_FOUND, 404);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async deleteAllReviewsByProductId(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    return this.reviewService.deleteAllReviewsByProductId(productId);
  }

  @Get('byProduct/:productId')
  getReviewByProductId(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    return this.reviewService.getReviewByProductId(productId);
  }
}
