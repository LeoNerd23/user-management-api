import { IUser } from '../models/User'; // Importando o tipo de usuário, se necessário

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
