import {
    USER_LOGIN,
    USER_FORGOT_PASSWORD,
    DASHBOARD_PATH,
    HOME_PATH,
    COURSES_PATH,
} from '../config/path'

const routes = [
  {
    path: USER_LOGIN,
    exact: true,
    isPrivate: false,
    component: import("../containers/auth/Login"),
    restricted: true,
  },
  {
    path: USER_FORGOT_PASSWORD,
    exact: true,
    isPrivate: false,
    component: import("../containers/auth/ForgotPassword"),
    restricted: true,
  },
  {
    path: DASHBOARD_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/welcome/HomeWelcome"),
    restricted: false,
  },
  {
    path: HOME_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/home/HomePage"),
    restricted: false,
  },
  {
    path: COURSES_PATH,
    exact: true,
    isPrivate: false,
    component: import("../containers/course/Courses"),
    restricted: false,
  },
];

export default routes
