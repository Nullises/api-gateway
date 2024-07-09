import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  async findAllProducts(@Query() paginationDto: PaginationDto) {
    return await this.productsClient
      .send(
        { cmd: 'find_all_products' },
        {
          limit: paginationDto.limit,
          page: paginationDto.page,
        },
      )
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get('/prices')
  async findProductsByPrice(@Query() query) {
    try {
      return await firstValueFrom(
        this.productsClient.send(
          { cmd: 'find_product_by_price' },
          {
            price: query.price,
          },
        ),
      );
    } catch (error) {
      throw new RpcException(error);
    }
    return;
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(
        this.productsClient.send(
          { cmd: 'find_product_by_id' },
          {
            id,
          },
        ),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsClient
      .send(
        { cmd: 'delete_product' },
        {
          id,
        },
      )
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch()
  async patchProduct(@Body() updateProductDto: UpdateProductDto) {
    return await this.productsClient
      .send({ cmd: 'update_product' }, updateProductDto)
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
