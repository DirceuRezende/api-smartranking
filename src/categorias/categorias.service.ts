import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}
  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);

    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${_id} não encotrada!`);
    }
    return categoriaEncontrada;
  }

  async atualizarCategoria(
    _id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ) {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${_id} não encontrada!`);
    }

    await this.categoriaModel
      .findOneAndUpdate(
        {
          _id,
        },
        {
          $set: atualizarCategoriaDto,
        },
      )
      .exec();
  }

  async consultarCategoriaDoJogador(idJogador: any): Promise<Categoria> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idJogador,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idJogador} não é um jogador!`);
    }

    return await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(idJogador)
      .exec();
  }

  async atribuirCategoriaJogador(_id: string, _idJogador) {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ _id })
      .exec();

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({
        _id,
      })
      .where('jogadores')
      .in(_idJogador);

    await this.jogadoresService.consultarJogadorPeloId(_idJogador);

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${_id} não encotrada!`);
    }

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${_idJogador} já cadastrado na Categoria ${_id}`,
      );
    }

    categoriaEncontrada.jogadores.push(_idJogador);

    await this.categoriaModel
      .findOneAndUpdate({ _id }, { $set: categoriaEncontrada })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
