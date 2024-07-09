import {
  IsString,
  IsNumber,
  MinLength,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public product: string;

  @IsBoolean()
  @IsOptional()
  public available: boolean;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  public price: number;
}
