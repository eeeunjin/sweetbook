require('dotenv').config();
const express = require('express');
const cors = require('cors');

const booksRouter = require('./routes/books');
const ordersRouter = require('./routes/orders');
const catalogRouter = require('./routes/catalog');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.SWEETBOOK_ENV || 'sandbox' }));

// Routes
app.use('/api/books', booksRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/catalog', catalogRouter);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: '경로를 찾을 수 없습니다.' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`환경: ${process.env.SWEETBOOK_ENV || 'sandbox'}`);
  if (!process.env.SWEETBOOK_API_KEY) {
    console.warn('경고: SWEETBOOK_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
  }
});
