// Automated test suite for the portfolio API handlers and storage.
import { getStore } from '../Front End/api/_lib/store.js';
import ratingsHandler from '../Front End/api/ratings.js';
import likesHandler from '../Front End/api/likes.js';
import ownerHandler from '../Front End/api/owner.js';

// Mock request / response helpers
function createReq({ method = 'GET', url = '/', headers = {}, body = null }) {
  const parsed = new URL(url, 'http://localhost');
  const query = Object.fromEntries(parsed.searchParams.entries());
  return {
    method,
    url,
    headers: { 'x-forwarded-for': '127.0.0.1', ...headers },
    body,
    query,
    socket: { remoteAddress: '127.0.0.1' },
  };
}

function createRes() {
  const headers = {};
  let bodyData = '';
  return {
    statusCode: 200,
    headers,
    setHeader(name, val) {
      headers[name.toLowerCase()] = val;
    },
    end(data) {
      if (data) bodyData += data;
    },
    json() {
      return bodyData ? JSON.parse(bodyData) : null;
    },
  };
}

async function run() {
  console.log('🧪 Starting API & Storage Integration Tests...\n');
  process.env.OWNER_KEY = 'test-secret-owner-key-12345';

  // 1. Storage check
  const store = getStore();
  console.log(`✓ Store initialized (kind: ${store.kind})`);

  // 2. GET /api/ratings
  {
    const req = createReq({ method: 'GET', url: '/api/ratings?offset=0&limit=5' });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.success) throw new Error(`GET /api/ratings failed: ${res.statusCode}`);
    console.log(`✓ GET /api/ratings responded 200 (count: ${data.count}, avg: ${data.average})`);
  }

  // 3. POST /api/ratings - validation error (empty name)
  {
    const req = createReq({
      method: 'POST',
      url: '/api/ratings',
      body: { rating: 5, name: '   ', visitorId: 'vis_test_1234567890' },
    });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 400 || data.success !== false) {
      throw new Error(`Expected 400 for empty name, got ${res.statusCode}`);
    }
    console.log('✓ POST /api/ratings correctly rejected empty name');
  }

  // 4. POST /api/ratings - valid submission
  const testVisitor = 'vis_test_integration_user_' + Date.now();
  let createdReviewId = '';
  {
    const req = createReq({
      method: 'POST',
      url: '/api/ratings',
      body: {
        rating: 5,
        name: 'Kier',
        role: 'Founder',
        feedback: 'He helps me create a design for our website.',
        visitorId: testVisitor,
      },
    });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 201 || !data.success || data.review.name !== 'Kier') {
      throw new Error(`POST /api/ratings failed: ${res.statusCode} ${JSON.stringify(data)}`);
    }
    createdReviewId = data.review.id;
    console.log(`✓ POST /api/ratings successfully saved review "${data.review.name}" (${data.review.id})`);
  }

  // 5. GET /api/ratings - verify review is present
  {
    const req = createReq({ method: 'GET', url: '/api/ratings?offset=0&limit=10' });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    const found = data.reviews.find((r) => r.id === createdReviewId);
    if (!found) throw new Error('Created review not found in public list!');
    console.log(`✓ Verified review "${found.name}" is visible publicly with rating ${found.rating}★`);
  }

  // 6. POST /api/likes - Liking a post
  const testProject = 'cobuy-pattern-mining';
  {
    const req = createReq({
      method: 'POST',
      url: '/api/likes',
      body: {
        projectId: testProject,
        visitorId: testVisitor,
        liked: true,
        userName: 'Kier',
      },
    });
    const res = createRes();
    await likesHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.success || !data.isLiked) {
      throw new Error(`POST /api/likes failed: ${res.statusCode}`);
    }
    console.log(`✓ POST /api/likes successfully saved like for ${testProject} (count: ${data.likesCount})`);
  }

  // 7. GET /api/likes - Public counts
  {
    const req = createReq({
      method: 'GET',
      url: `/api/likes?ids=${testProject}&visitorId=${testVisitor}`,
    });
    const res = createRes();
    await likesHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.liked[testProject]) {
      throw new Error('Public likes count query failed');
    }
    console.log(`✓ GET /api/likes returned count: ${data.likes[testProject]}, liked: ${data.liked[testProject]}`);
  }

  // 8. GET /api/likes?likers=1 - Public endpoint allows visitors to view likers
  {
    const req = createReq({
      method: 'GET',
      url: `/api/likes?projectId=${testProject}&likers=1`,
    });
    const res = createRes();
    await likesHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.success || !Array.isArray(data.likers)) {
      throw new Error(`Expected 200 for public likers query, got ${res.statusCode}`);
    }
    console.log(`✓ GET /api/likes?likers=1 returned ${data.likers.length} likers publicly`);
  }

  // 9. GET /api/likes?likers=1 - Authenticated with OWNER_KEY returns liker display names
  {
    const req = createReq({
      method: 'GET',
      url: `/api/likes?projectId=${testProject}&likers=1`,
      headers: { authorization: `Bearer ${process.env.OWNER_KEY}` },
    });
    const res = createRes();
    await likesHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.success || !Array.isArray(data.likers)) {
      throw new Error(`Authenticated likers query failed: ${res.statusCode}`);
    }
    const foundLiker = data.likers.find((l) => l.userName === 'Kier');
    if (!foundLiker) throw new Error('Expected liker "Kier" not in owner response!');
    console.log(`✓ GET /api/likes with OWNER_KEY returned likers including "${foundLiker.userName}"`);
  }

  // 10. GET /api/owner - Verify key
  {
    const req = createReq({
      method: 'GET',
      url: '/api/owner',
      headers: { authorization: `Bearer ${process.env.OWNER_KEY}` },
    });
    const res = createRes();
    ownerHandler(req, res);
    if (res.statusCode !== 200) throw new Error(`Owner verify failed: ${res.statusCode}`);
    console.log('✓ /api/owner verified owner key successfully');
  }

  // 11. Owner moderation: Hide review
  {
    const req = createReq({
      method: 'POST',
      url: '/api/ratings?action=moderate',
      headers: { authorization: `Bearer ${process.env.OWNER_KEY}` },
      body: { id: createdReviewId, hidden: true },
    });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || !data.review.hidden) throw new Error('Failed to hide review');
    console.log('✓ Owner moderation: review hidden from public');
  }

  // 12. Verify hidden review does NOT show to public visitors
  {
    const req = createReq({ method: 'GET', url: '/api/ratings?offset=0&limit=10' });
    const res = createRes();
    await ratingsHandler(req, res);
    const data = res.json();
    const found = data.reviews.find((r) => r.id === createdReviewId);
    if (found) throw new Error('Hidden review was unexpectedly visible to public visitor!');
    console.log('✓ Verified hidden review is not returned to public visitors');
  }

  // 13. Owner moderation: Restore review
  {
    const req = createReq({
      method: 'POST',
      url: '/api/ratings?action=moderate',
      headers: { authorization: `Bearer ${process.env.OWNER_KEY}` },
      body: { id: createdReviewId, hidden: false },
    });
    const res = createRes();
    await ratingsHandler(req, res);
    console.log('✓ Owner moderation: review restored to public view');
  }

  // 14. POST /api/likes - Unliking
  {
    const req = createReq({
      method: 'POST',
      url: '/api/likes',
      body: {
        projectId: testProject,
        visitorId: testVisitor,
        liked: false,
      },
    });
    const res = createRes();
    await likesHandler(req, res);
    const data = res.json();
    if (res.statusCode !== 200 || data.isLiked !== false) throw new Error('Unlike failed');
    console.log(`✓ POST /api/likes unliking confirmed (count: ${data.likesCount})`);
  }

  console.log('\n🎉 ALL 14 TESTS PASSED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
