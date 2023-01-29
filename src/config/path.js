// Base path
export const BASE_PATH = '/memories'
export const ADMIN_PATH='/admin'

// Authenticate
export const USER_LOGIN = `${BASE_PATH}/login`
export const USER_REGISTER = `${BASE_PATH}/register`;
export const USER_FORGOT_PASSWORD = `${BASE_PATH}/forgot-password`;
export const USER_RESET_PASSWORD = `${BASE_PATH}/reset-password`;

// Dashboard
export const DASHBOARD_PATH = `/`;

// Component
export const HOME_PATH = `${BASE_PATH}/home`;
export const COURSES_PATH = `${BASE_PATH}/courses`;
export const GROUPS_PATH = `${BASE_PATH}/groups`;
export const EXAMS_PATH = `${BASE_PATH}/:courseId/exams`;

// Course
export const COURSE_CREATE_PATH = `${COURSES_PATH}/create`;
export const COURSE_DETAIL_PATH = `${COURSES_PATH}/:courseId`;
export const COURSE_EDIT_PATH = `${COURSES_PATH}/:courseId/edit`;
export const COURSE_LIST_OWNER_PATH = `${COURSES_PATH}/owner`;
export const COURSE_LEARN_PATH = `${COURSES_PATH}/learn/:courseId`;

// Exam
export const EXAM_DETAIL_PATH = `${EXAMS_PATH}/:examId`;
export const EXAM_EDIT_PATH = `${EXAMS_PATH}/:examId/edit`;
export const EXAM_ONLINE_PATH = `${EXAMS_PATH}/:examId/online`;

// Admin
export const USER_LIST_PATH = `${ADMIN_PATH}/users`;