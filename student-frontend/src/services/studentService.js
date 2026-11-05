// Student API client service

const API_BASE = '/api/culala/students';

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
