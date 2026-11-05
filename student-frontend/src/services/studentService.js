// Student API client service

const STORAGE_KEY = 'STUDENT_API_URL_OVERRIDE';

/**
 * Get manually configured URL from localStorage if set by user in UI
 */
export function getCustomApiUrl() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || '';
  }
  return '';
}

/**
 * Set manual URL in localStorage
 */
export function setCustomApiUrl(url) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

/**
 * Clean and normalize API URL to ensure it points to /culala/students or /students
 */
export function formatEndpoint(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) return '/api/culala/students';

  let clean = rawUrl.trim().replace(/\/+$/, '');

  // If host lacks protocol and doesn't start with /
  if (!/^https?:\/\//i.test(clean) && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }

  // If it's a bare Render internal host without domain (e.g. "student-backend" or "student-backend:8080")
  const hostOnly = clean.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
  if (!hostOnly.includes('.') && !hostOnly.includes('localhost')) {
    clean = `https://${hostOnly}.onrender.com`;
  }

  // Append resource path if neither /culala/students nor /students is present
  if (!clean.endsWith('/culala/students') && !clean.endsWith('/students')) {
    clean = `${clean}/culala/students`;
  }

  return clean;
}

/**
 * Resolve the current active API endpoint
 */
export function getApiBase() {
  // 1. User manual override from UI
  const custom = getCustomApiUrl();
  if (custom) {
    return formatEndpoint(custom);
  }

  // 2. Localhost development (uses Vite proxy)
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '/api/culala/students';
  }

  // 3. Environment variable (VITE_API_BASE_URL set by Render Blueprint or .env)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return formatEndpoint(envUrl);
  }

  // 4. Default fallback
  return '/api/culala/students';
}

/**
 * Helper to handle fetch responses safely
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'string' ? data : (data?.message || 'API request failed');
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  return data;
}

export const studentService = {
  /**
   * Return current endpoint URL
   */
  getCurrentEndpoint() {
    return getApiBase();
  },

  /**
   * Test connection to a specific endpoint
   */
  async testConnection(targetUrl) {
    const url = targetUrl ? formatEndpoint(targetUrl) : getApiBase();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return { ok: res.ok, status: res.status, url };
    } catch (err) {
      clearTimeout(timeoutId);
      return { ok: false, error: err.message, url };
    }
  },

  /**
   * Fetch all students
   * GET /culala/students
   */
  async getAll() {
    const endpoint = getApiBase();
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },

  /**
   * Fetch a single student by ID
   * GET /culala/students/:id
   */
  async getById(id) {
    const endpoint = `${getApiBase()}/${id}`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },

  /**
   * Create a new student
   * POST /culala/students
   */
  async create(studentData) {
    const endpoint = getApiBase();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstname: studentData.firstname?.trim(),
        lastname: studentData.lastname?.trim(),
        course: studentData.course?.trim(),
        section: studentData.section?.trim(),
      }),
    });
    return handleResponse(res);
  },

  /**
   * Update an existing student
   * PUT /culala/students/:id
   */
  async update(id, studentData) {
    const endpoint = `${getApiBase()}/${id}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstname: studentData.firstname?.trim(),
        lastname: studentData.lastname?.trim(),
        course: studentData.course?.trim(),
        section: studentData.section?.trim(),
      }),
    });
    return handleResponse(res);
  },

  /**
   * Delete a student by ID
   * DELETE /culala/students/:id
   */
  async delete(id) {
    const endpoint = `${getApiBase()}/${id}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
