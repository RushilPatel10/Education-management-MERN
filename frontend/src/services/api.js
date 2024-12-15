import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ApiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log('Register error:', error.response?.data || error);
      throw error;
    }
  },

  // User endpoints
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Course endpoints
  getEnrolledCourses: async () => {
    const response = await api.get('/courses/enrolled');
    return response.data;
  },

  getTeacherCourses: async () => {
    const response = await api.get('/courses/teaching');
    return response.data;
  },

  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  // Assignment endpoints
  getStudentAssignments: async () => {
    const response = await api.get('/assignments/student');
    return response.data;
  },

  getTeacherAssignments: async () => {
    const response = await api.get('/assignments/teacher');
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
    return response.data;
  },

  // Grade endpoints
  getStudentGrades: async () => {
    const response = await api.get('/grades/student');
    return response.data;
  },

  submitGrade: async (submissionId, gradeData) => {
    const response = await api.post(`/grades/${submissionId}`, gradeData);
    return response.data;
  }
};

export default ApiService; 