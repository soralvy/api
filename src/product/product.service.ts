import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productRepository: ModelType<ProductModel>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    return this.productRepository.create(dto);
  }

  async findProductById(id: string) {
    return this.productRepository.findById(id).exec();
  }

  async deleteProductById(id: string) {
    return this.productRepository.findByIdAndDelete(id).exec();
  }

  async updateProductById(id: string, dto: CreateProductDto) {
    return this.productRepository
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async findProductWithReviews(dto: FindProductDto) {
    return this.productRepository
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $lookup: {
            from: 'Review', // schema options collection name
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function (reviews) {
            		reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            		return reviews;
            	}`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec();
  }
}
