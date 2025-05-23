export const PROFILE_PICTURE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s'
export const API_URL = "https://api.localhost";
export const ACCOUNTS_URL = "https://accounts.localhost";
export const PULSE_URL = "https://localhost";

export const USER_ENDPOINTS = {
  SIGNUP: '/users/signup',
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