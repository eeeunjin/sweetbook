const express = require('express');
const router = express.Router();
const api = require('../services/api');

// Sandbox에서 사용 가능한 실제 템플릿 UID (PHOTOBOOK_A4_SC 기준)
const DEFAULT_COVER_TEMPLATE = '75HruEK3EnG5';   // 표지 (A4 소프트커버 포토북)
const DEFAULT_CONTENT_TEMPLATE = '5ADDkCtrodEJ'; // 내지_photo (A4)
const DEFAULT_BLANK_TEMPLATE = '2lpHl6oLAYss';   // 빈내지 (A4)
const DEFAULT_BOOK_SPEC = 'PHOTOBOOK_A4_SC';
const MIN_PAGES = 24; // PHOTOBOOK_A4_SC 최소 페이지

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const data = await api.listBooks(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// POST /api/books
router.post('/', async (req, res) => {
  try {
    const { bookSpecUid, title, creationType } = req.body;
    if (!bookSpecUid) return res.status(400).json({ success: false, message: 'bookSpecUid는 필수입니다.' });
    const data = await api.createBook({ bookSpecUid, title, creationType: creationType || 'TEST' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// POST /api/books/:bookUid/finalization
router.post('/:bookUid/finalization', async (req, res) => {
  try {
    const data = await api.finalizeBook(req.params.bookUid);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

// DELETE /api/books/:bookUid
router.delete('/:bookUid', async (req, res) => {
  try {
    await api.deleteBook(req.params.bookUid);
    res.json({ success: true });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/books/build
 *
 * 카페 메뉴북 전체 빌드: 북 생성 → 표지 → 내지(메뉴별) → 빈내지(패딩) → 최종화
 *
 * 사용 템플릿 (PHOTOBOOK_A4_SC):
 *   표지: 75HruEK3EnG5 — childName(카페명), schoolName(슬로건), volumeLabel, periodText, coverPhoto
 *   내지: 5ADDkCtrodEJ — dayLabel(메뉴명+가격), photo(이미지URL), hasDayLabel
 *   빈내지: 2lpHl6oLAYss — bookTitle, year, month
 */
router.post('/build', async (req, res) => {
  const {
    cafeInfo,
    menuItems,
    bookSpecUid = DEFAULT_BOOK_SPEC,
    coverTemplateUid = DEFAULT_COVER_TEMPLATE,
    contentTemplateUid = DEFAULT_CONTENT_TEMPLATE,
  } = req.body;

  if (!cafeInfo || !menuItems?.length) {
    return res.status(400).json({ success: false, message: 'cafeInfo와 menuItems는 필수입니다.' });
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1);

  let bookUid = null;

  try {
    // 1. 북 생성
    const book = await api.createBook({
      bookSpecUid,
      title: `${cafeInfo.name} 메뉴북`,
      creationType: 'TEST',
    });
    bookUid = book.bookUid || book.uid;

    // 2. 표지
    if (coverTemplateUid) {
      await api.createCover(bookUid, coverTemplateUid, {
        childName: cafeInfo.name,
        schoolName: cafeInfo.tagline || cafeInfo.name,
        volumeLabel: 'MENU',
        periodText: `${year} 메뉴`,
        coverPhoto: cafeInfo.logoUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      });
    }

    // 3. 내지 — 메뉴 아이템별 (breakBefore: 'page' 로 1아이템=1페이지)
    if (contentTemplateUid) {
      const FALLBACK_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop';

      for (const item of menuItems) {
        await api.insertContent(bookUid, contentTemplateUid, {
          dayLabel: `${item.name}\n₩${Number(item.price).toLocaleString()}`,
          photo: item.imageUrl || FALLBACK_IMG,
          hasDayLabel: 'true',
        }, { breakBefore: 'page' });
      }

      // 4. 빈내지 패딩 (최소 페이지 수 맞추기, breakBefore: 'page' 동일 적용)
      const pagesUsed = menuItems.length;
      const blankNeeded = Math.max(0, MIN_PAGES - pagesUsed);
      if (blankNeeded > 0) {
        for (let i = 0; i < blankNeeded; i++) {
          await api.insertContent(bookUid, contentTemplateUid, {
            dayLabel: ' ',
            photo: FALLBACK_IMG,
            hasDayLabel: 'false',
          }, { breakBefore: 'page' });
        }
      }
    }

    // 5. 최종화
    const finalized = await api.finalizeBook(bookUid);

    res.json({
      success: true,
      message: '메뉴북이 성공적으로 생성되었습니다.',
      data: { bookUid, ...finalized },
    });
  } catch (err) {
    if (bookUid) api.deleteBook(bookUid).catch(() => {});
    const details = err.details || err.response?.data?.errors || null;
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      details,
    });
  }
});

module.exports = router;
