import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JogadoresModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@api-smartranking.kqk4x.mongodb.net/smartranking?retryWrites=true&w=majority`,
    ),
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
