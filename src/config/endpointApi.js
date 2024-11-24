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
export const API_COURSE_DELETE = `${API_COURSE_LIST}/delete`;
export const API_COURSE_EDIT = `${API_COURSE_LIST}/edit`;
export const API_COURSES_LIST_ALL = `${API_COURSE_LIST}/list/all`;
export const API_UPLOAD_FILE = `${API_COURSE_LIST}/upload`;

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
const API_UNIT = `${API_BASE}/units`;
export const API_USERS_LIST = `${API_ADMIN}/users`;
export const API_UNIT_LIST_BY_COURSE = `${API_UNIT}/`;
export const API_UNIT_CREATE = `${API_UNIT}/create`;
export const API_UNIT_EDIT = `${API_UNIT}/edit`;
export const API_UNIT_DETAIL = `${API_UNIT}/detail`;
export const API_UNIT_DELETE = `${API_UNIT}/delete`;

const API_LESSON = `${API_BASE}/lessons`;
export const API_LESSONS_LIST_BY_UNIT_ID = `${API_LESSON}/`;
export const API_LESSON_CREATE = `${API_LESSON}/create`;
export const API_LESSON_EDIT = `${API_LESSON}/edit`;
export const API_LESSON_DETAIL = `${API_LESSON}/detail`;
export const API_LESSON_DELETE = `${API_LESSON}/delete`;
