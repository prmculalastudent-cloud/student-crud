// Student API client service

/**
 * Determine API base URL:
 * 1. If VITE_API_BASE_URL is defined (e.g. deployed on Render), use it.
 * 2. Otherwise use the local Vite proxy path '/api/culala/students'.
 */
function getApiBase() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    // If the provided URL already contains /culala/students, don't duplicate
    if (clean.endsWith('/culala/students')) {
      return clean;
    }
    return `${clean}/culala/students`;
  }
  return '/api/culala/students';
}

const API_BASE = getApiBase();

/**
 * Helper to handle fetch responses safely (supporting both JSON and plain text responses)
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
   * Fetch all students
   * GET /culala/students
   */
  async getAll() {
    const res = await fetch(API_BASE, {
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
    const res = await fetch(`${API_BASE}/${id}`, {
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
    const res = await fetch(API_BASE, {
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
    const res = await fetch(`${API_BASE}/${id}`, {
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
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
