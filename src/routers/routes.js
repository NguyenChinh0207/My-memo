import {
  USER_LOGIN,
  USER_FORGOT_PASSWORD,
  DASHBOARD_PATH,
  HOME_PATH,
  COURSES_PATH,
  USER_REGISTER,
  COURSE_CREATE_PATH,
  COURSE_DETAIL_PATH,
  COURSE_EDIT_PATH,
} from "../config/path";

const routes = [
  {
    path: USER_LOGIN,
    exact: true,
    isPrivate: false,
    component: import("../containers/auth/Login"),
    // restricted: false,
  },
  {
    path: USER_REGISTER,
    exact: true,
    isPrivate: false,
    component: import("../containers/auth/Signup"),
    // restricted: true,
  },
  {
    path: USER_FORGOT_PASSWORD,
    exact: true,
    isPrivate: false,
    component: import("../containers/auth/ForgotPassword"),
    // restricted: true,
  },
  {
    path: DASHBOARD_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/welcome/HomeWelcome"),
    restricted: true,
  },
  {
    path: HOME_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/home/HomePage"),
    restricted: false,
  },
  {
    path: COURSES_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/Courses"),
    restricted: false,
  },
  {
    path: COURSE_CREATE_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/CreateCourse"),
    restricted: false,
  },
  {
    path: COURSE_DETAIL_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/course/CourseDetail"),
    restricted: false,
  },
  {
    path: COURSE_EDIT_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/course/CourseEdit"),
    restricted: false,
  },
];

export default routes;
