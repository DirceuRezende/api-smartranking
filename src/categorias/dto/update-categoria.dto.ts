import { PartialType } from '@nestjs/mapped-types';
import { CriarCategoriaDto } from './criar-categoria.dto';

export class UpdateCategoriaDto extends PartialType(CriarCategoriaDto) {}
