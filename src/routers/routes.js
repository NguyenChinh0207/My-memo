import {
    ADMIN_LOGIN,
    ADMIN_FORGOT_PASSWORD,
    ADMIN_RESET_PASSWORD,
} from '../config/path'

const routes = [
  {
        path: ADMIN_LOGIN,
        exact: true,
        isPrivate: false,
        component: import('../components/auth/Login'),
        restricted: true,
    },
    {
        path: ADMIN_FORGOT_PASSWORD,
        exact: true,
        isPrivate: false,
        component: import('../components/auth/ForgotPassword'),
        restricted: true,
    },
    {
        path: ADMIN_RESET_PASSWORD,
        exact: true,
        isPrivate: false,
        component: import('../components/auth/ResetPassword'),
        restricted: true,
    },
]

export default routes
