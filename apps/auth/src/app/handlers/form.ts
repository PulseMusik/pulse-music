const API_URL = "https://api.localhost";
const ACCOUNTS_URL = "https://accounts.localhost";
const PULSE_URL = "https://localhost";

const USER_ENDPOINTS = {
  SIGNUP: '/users/create_user',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  FORGOT_PASSWORD: '/users/forgot-password',
  RESET_PASSWORD: '/users/reset-password',
  VERIFY_EMAIL: '/users/verify-email',
} as const;

const AUTH_PROVIDERS_URLS = {
    GOOGLE: '/users/google',
} as const;

interface SignupProps {
    username: string,
    email: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    gender: string,
    dob: {
        day: number,
        month: string,
        year: number
    },
    password: string
}

interface LoginProps {
    email: string,
    password: string
}

export async function submitSignupToServer(formData: SignupProps, setErrorMessage: any) {
    try {
        const res = await fetch(`${API_URL}${USER_ENDPOINTS.SIGNUP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()

            if (error.message === 'Email already registered') {
                setErrorMessage('Email has already been registered. Please sign in or use a different address.');
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
            return;
        }
        window.location.href = ACCOUNTS_URL!
    } catch (e: any) {
        if (e.message === 'Email already registered') {
            setErrorMessage('Email has already been registered. Please sign in or use a different address.')
        } else {
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }
}

export async function submitLogintoServer(formData: LoginProps, setErrorMessage: any, redirect?: string) {
    try {
        const res = await fetch(`${API_URL}${USER_ENDPOINTS.LOGIN}?redirect_url=${encodeURIComponent(redirect as string)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()

            if (error.message === 'Email already registered') {
                setErrorMessage('Email has already been registered. Please sign in or use a different address.');
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
            return;
        }

        const data = await res.json()

        if (res.ok && data.redirectUrl) {
            window.location.href = data.redirectUrl
        }
    } catch (e: any) {
        if (e.message === 'Email already registered') {
            setErrorMessage('Email has already been registered. Please sign in or use a different address.')
        } else {
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }
}

export async function submitGoogleAuthToServer() {
    try {
        const res = await fetch(`${API_URL}${AUTH_PROVIDERS_URLS.GOOGLE}`, {
            method: 'GET',
            credentials: 'include'
        })
    } catch (e: any) {
        console.error(e)
    }
}