import * as mogoose from 'mongoose';

export const JogadorSchema = new mogoose.Schema(
  {
    telefoneCelular: { type: String },
    email: { type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
