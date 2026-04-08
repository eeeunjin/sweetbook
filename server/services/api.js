require('dotenv').config();
const { SweetbookClient } = require('../sdk');

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.SWEETBOOK_API_KEY) {
      throw new Error('SWEETBOOK_API_KEY 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
    }
    _client = new SweetbookClient({
      apiKey: process.env.SWEETBOOK_API_KEY,
      environment: process.env.SWEETBOOK_ENV || 'sandbox',
    });
  }
  return _client;
}

// ─── Books ────────────────────────────────────────────────────────────────────

async function createBook(data) {
  return getClient().books.create(data);
}

async function listBooks(params) {
  return getClient().books.list(params);
}

async function finalizeBook(bookUid) {
  return getClient().books.finalize(bookUid);
}

async function deleteBook(bookUid) {
  return getClient().books.delete(bookUid);
}

// ─── Photos ───────────────────────────────────────────────────────────────────

async function uploadPhoto(bookUid, file) {
  return getClient().photos.upload(bookUid, file);
}

// ─── Cover ───────────────────────────────────────────────────────────────────

async function createCover(bookUid, templateUid, parameters, files) {
  return getClient().covers.create(bookUid, templateUid, parameters, files);
}

// ─── Contents ─────────────────────────────────────────────────────────────────

async function insertContent(bookUid, templateUid, parameters, options) {
  return getClient().contents.insert(bookUid, templateUid, parameters, options);
}

async function clearContents(bookUid) {
  return getClient().contents.clear(bookUid);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

async function estimateOrder(data) {
  return getClient().orders.estimate(data);
}

async function createOrder(data) {
  return getClient().orders.create(data);
}

async function listOrders(params) {
  return getClient().orders.list(params);
}

async function getOrder(orderUid) {
  return getClient().orders.get(orderUid);
}

async function cancelOrder(orderUid, cancelReason) {
  return getClient().orders.cancel(orderUid, cancelReason);
}

// ─── Credits ─────────────────────────────────────────────────────────────────

async function getCredits() {
  return getClient().credits.getBalance();
}

async function sandboxCharge(amount, memo) {
  return getClient().credits.sandboxCharge(amount, memo);
}

// ─── Catalog (직접 HTTP) ──────────────────────────────────────────────────────

const https = require('https');

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const env = process.env.SWEETBOOK_ENV || 'sandbox';
    const host = env === 'live' ? 'api.sweetbook.com' : 'api-sandbox.sweetbook.com';
    const options = {
      hostname: host,
      path: `/v1${path}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SWEETBOOK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function listBookSpecs() {
  return apiGet('/book-specs');
}

async function listTemplates(query = '') {
  return apiGet(`/templates${query ? `?${query}` : ''}`);
}

async function listTemplateCategories() {
  return apiGet('/template-categories');
}

module.exports = {
  createBook,
  listBooks,
  finalizeBook,
  deleteBook,
  uploadPhoto,
  createCover,
  insertContent,
  clearContents,
  estimateOrder,
  createOrder,
  listOrders,
  getOrder,
  cancelOrder,
  getCredits,
  sandboxCharge,
  listBookSpecs,
  listTemplates,
  listTemplateCategories,
};
