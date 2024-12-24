import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes';
import dbconnect from './database';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Roteador de usuários
app.use('/users', userRoutes);

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Server working!');
});

// Porta do servidor
const port = process.env.PORT || 3000;

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});

// Database connection
dbconnect();
