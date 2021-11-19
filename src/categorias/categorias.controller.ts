import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(
    @Query() params: string[],
  ): Promise<Array<Categoria> | Categoria> {
    const idCategoria = params['idCategoria'];
    const idJogador = params['idJogador'];

    if (idCategoria) {
      return await this.categoriasService.consultarCategoriaPeloId(idCategoria);
    }

    if (idJogador) {
      return await this.categoriasService.consultarCategoriaDoJogador(
        idJogador,
      );
    }

    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get(':_id')
  async consultarCategoriaPeloId(
    @Param('_id') _id: string,
  ): Promise<Categoria> {
    return this.categoriasService.consultarCategoriaPeloId(_id);
  }

  @Put(':_id')
  async atualizarCategoria(
    @Param('_id') _id: string,
    @Body() updateCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    console.log(updateCategoriaDto);
    await this.categoriasService.atualizarCategoria(_id, updateCategoriaDto);
  }

  @Post(':_id/jogadores/:_idJogador')
  async atribuirCategoriaJogador(
    @Param('_id') _id,
    @Param('_idJogador') _idJogador,
  ): Promise<void> {
    await this.categoriasService.atribuirCategoriaJogador(_id, _idJogador);
  }

  @Delete(':_id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }
}
