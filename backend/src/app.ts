// Erasmo Cardoso 
//APP
import express from 'express';
import cors from 'cors';
import router from './routes/routes';

const app = express();

// CORS 
app.use(cors());

app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


export default app;