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
  COURSE_LIST_OWNER_PATH,
  COURSE_LEARN_PATH,
  EXAM_EDIT_PATH,
  EXAM_DETAIL_PATH,
  EXAM_ONLINE_PATH,
  USER_LIST_PATH,
  USER_DETAIL_PATH,
  ADMIN_COURSE_LIST_PATH,
  ADMIN_COURSE_DETAIL_PATH,
  ADMIN_CREATE_UNIT_PATH,
  ADMIN_EDIT_UNIT_PATH,
  ADMIN_CREATE_LESSON_PATH,
  ADMIN_EDIT_LESSON_PATH,
  UNIT_DETAIL_PATH,
  LESSON_DETAIL_PATH,
  ADMIN_MY_COURSE_DETAIL_PATH,
  ADMIN_MY_COURSE_EDIT_PATH,
  ADMIN_MY_COURSE_CREATE_PATH,
  ADMIN_MY_COURSE_LIST_PATH,
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
    path: COURSE_LIST_OWNER_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/CoursesOwner"),
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
    path: UNIT_DETAIL_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/course/UnitDetail"),
    restricted: false,
  },
  {
    path: LESSON_DETAIL_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/course/LessonDetail"),
    restricted: false,
  },
  {
    path: COURSE_EDIT_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/courses/course/CourseEdit"),
    restricted: false,
  },
  {
    path: COURSE_LEARN_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/learn/Learn"),
    restricted: false,
  },
  {
    path: EXAM_EDIT_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/exams/ExamEdit"),
    restricted: false,
  },
  {
    path: EXAM_ONLINE_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/exams/ExamOnline"),
    restricted: false,
  },
  {
    path: EXAM_DETAIL_PATH,
    exact: true,
    isPrivate: true,
    component: import("../containers/exams/ExamDetail"),
    restricted: false,
  },
  {
    path: USER_LIST_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/users/UserList"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: USER_DETAIL_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/users/UserDetail"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_COURSE_LIST_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/CourseList"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_COURSE_DETAIL_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/CourseDetail"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_MY_COURSE_LIST_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/MyCourseList"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_MY_COURSE_CREATE_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/MyCourseAction"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_MY_COURSE_EDIT_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/MyCourseAction"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_MY_COURSE_DETAIL_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/MyCourseDetail"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_CREATE_UNIT_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/units/UnitAction"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_EDIT_UNIT_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/units/UnitAction"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_CREATE_LESSON_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/units/RenderLessons"),
    restricted: false,
    isAdmin: true,
  },
  {
    path: ADMIN_EDIT_LESSON_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/admin/courses/units/RenderLessons"),
    restricted: false,
    isAdmin: true,
  },
];

export default routes;
