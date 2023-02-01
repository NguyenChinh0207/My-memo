const API_BASE_AUTH = `${process.env.REACT_APP_BASE_URL}/api/auth`;
export const API_LOGIN = `${API_BASE_AUTH}/login`;
export const API_SAVE_USER = `${API_BASE_AUTH}/save/user`;
export const API_REGISTER = `${API_BASE_AUTH}/register`;
export const API_USER_EDIT = `${API_BASE_AUTH}/edit`;

const API_BASE = `${process.env.REACT_APP_BASE_URL}/api`;
export const API_COURSE_LIST = `${API_BASE}/courses`;
export const API_COURSE_OWNER_LIST = `${API_BASE}/courses/list/owner`;
export const API_COURSE_CREATE = `${API_BASE}/courses/create`;
export const API_COURSE_DETAIL = `${API_COURSE_LIST}/detail`;
export const API_ACTION_MY_COURSE = `${API_COURSE_LIST}/wishlist`;
export const API_GET_MY_COURSE = `${API_COURSE_LIST}/mycourses`;
export const API_DELETE_COURSE = `${API_COURSE_LIST}/delete`;
export const API_COURSE_EDIT = `${API_COURSE_LIST}/edit`;
export const API_COURSES_LIST_ALL = `${API_COURSE_LIST}/list/all`;

const API_WORD_LIST = `${API_BASE}/words`;
export const API_CREATE_WORD = `${API_WORD_LIST}/create`;
export const API_DELETE_WORD = `${API_WORD_LIST}/delete`;
export const API_UPDATE_WORDS = `${API_WORD_LIST}/update`;

export const API_GET_PROGRESS = `${API_BASE}/progress/detail`;
export const API_UPDATE_PROGRESS = `${API_BASE}/progress/update`;
export const API_POST_PROGRESS = `${API_BASE}/progress/create`;

export const API_EXAM_LIST = `${API_BASE}/exams`
export const API_EXAM_CREATE = `${API_EXAM_LIST}/create`;
export const API_EXAM_EDIT = `${API_EXAM_LIST}/edit`;
export const API_EXAM_DETAIL = `${API_EXAM_LIST}/detail`;
export const API_EXAM_DELETE = `${API_EXAM_LIST}/delete`;
export const API_GET_EXAM_BY_COURSEID = `${API_EXAM_LIST}/course-id`;

// admin
const API_ADMIN = `${API_BASE}/admin`;
export const API_USERS_LIST = `${API_ADMIN}/users`;

