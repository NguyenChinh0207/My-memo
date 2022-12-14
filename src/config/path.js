// Base path
export const BASE_PATH = '/memories'

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

// Course
export const COURSE_CREATE_PATH = `${COURSES_PATH}/create`;
export const COURSE_DETAIL_PATH = `${COURSES_PATH}/:courseId`;
export const COURSE_EDIT_PATH = `${COURSES_PATH}/:courseId/edit`;
