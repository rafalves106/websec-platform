require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sessionsRouter = require('./routes/sessions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessionsRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
