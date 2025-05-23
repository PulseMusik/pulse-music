export const API_URL = "https://api.localhost";
export const ACCOUNTS_URL = "https://accounts.localhost";
export const PULSE_URL = "https://localhost";

export const USER_ENDPOINTS = {
  SIGNUP: '/users/create_user',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  FORGOT_PASSWORD: '/users/forgot-password',
  RESET_PASSWORD: '/users/reset-password',
  VERIFY_EMAIL: '/users/verify-email',
} as const;

export const FRONTEND_USER_ENDPOINTS = {
    SIGNUP: '/v1/onboarding/signup',
    LOGIN: '/v1/login'
} as const;

export type UserEndpointKey = keyof typeof USER_ENDPOINTS;
export type UserEndpointPath = (typeof USER_ENDPOINTS)[UserEndpointKey];

export const AUTH_PROVIDERS_ENABLED = {
  GOOGLE: true,
  APPLE: false,
  MICROSOFT: false,
} as const;

export const AUTH_PROVIDERS_URLS = {
    GOOGLE: '/users/google',
} as const;

export type AuthProviderKey = keyof typeof AUTH_PROVIDERS_ENABLED;
export type AuthProviderEnabledMap = typeof AUTH_PROVIDERS_ENABLED;

export const DEFAULT_PROFILE_PICTURE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s';

export const SUPPORTED_LANGUAGES = [
    {
        'title': 'English',
        'code': 'en',
    },
    {
        'title': 'Spanish',
        'code': 'es',
    },
    {
        'title': 'French',
        'code': 'fr',
    },
    {
        'title': 'German',
        'code': 'de',
    },
    {
        'title': 'Italian',
        'code': 'it',
    },
    {
        'title': 'Portuguese',
        'code': 'pt',
    },
    {
        'title': 'Dutch',
        'code': 'nl',
    },
    {
        'title': 'Russian',
        'code': 'ru',
    },
    {
        'title': 'Turkish',
        'code': 'tr',
    },
]

export const ARTIST_ENDPOINTS = {
    GET_ARTIST_ID: '/artists/get-artist-id',
}

export const ACCOUNTS_URL_ENDPOINTS = {
    SETTINGS: '/settings',
    LANGUAGE: '/language',
    INFO: '/info'
}

export const COPYRIGHT_LABEL = `© ${new Date().getFullYear()} PulseMusik`;

export const REDIRECT_WHITELIST = [ACCOUNTS_URL, PULSE_URL, 'https://youtube.com']

export const COMPANY_NAME = "PulseMusik"
export const COMPANY_NICKNAME = "Pulse"
export const APP_NAMES = {
    MAIN: "Pulse Music",
    ACCOUNTS: "Pulse Accounts",
    ARTISTS: "Pulse for Artists",
    DOCS: "Pulse Docs"
}

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    // domain: '.localhost'
}

export const LOGOS = {
    FAVICON: 'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw',
    MAIN_LOGO: 'https://i.ibb.co/YFxrgxDy/blue-filled.png'
}