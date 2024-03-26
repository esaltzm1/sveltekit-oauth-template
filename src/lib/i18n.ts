export const displayStrings = {
	pages: {
		login: {
			labels: {
				email: 'Email',
				password: 'Password'
			},
			placeholder: {
				email: 'you@me.com',
				password: 'password'
			},
			errors: {
				emailDoesNotExist: 'Incorrect email or password',
				invalidPassword: 'Incorrect email or password'
			}
		},
		register: {
			labels: {
				email: 'Email',
				password: 'Password',
				confirmPassword: 'Confirm password'
			},
			placeholder: {
				email: 'you@me.com',
				password: 'password',
				confirmPassword: 'password'
			},
			errors: {
				passwordsDontMatch: "Passwords don't match",
				accountExistsWithEmail: 'An account already exists with this emaiil'
			}
		},
		'password-reset': {
			title: 'Password reset',
			content: 'Use this page to reset your Saleswriter password.',
			successSubtitle: 'Check your email for a reset link.',
			email: {
				title: 'Reset your password',
				subtitle: 'You requested a password reset',
				isEmailUnexpected: 'If you did not request a password reset, please ignore this email or',
				contactSupport: 'contact support',
				labels: {
					resetPasswordButton: 'Reset password'
				},
				resetPasswordButtonSubtitle: 'This link will expire in 2 hours.'
			},
			labels: {
				email: 'Email'
			},
			placeholder: {
				email: 'you@me.com'
			},
			errors: {
				resendApiError: `We're having troubles sending emails right now. Please try again in a bit.`
			},
			token: {
				labels: {
					password: 'Password',
					confirmPassword: 'Confirm password'
				},
				placeholder: {
					password: 'password',
					confirmPassword: 'password'
				},
				errors: {
					expiredToken: 'This link has expired.'
				}
			}
		}
	},
	buttons: {
		login: 'Log in',
		logout: 'Log out',
		register: 'Register',
		forgotPassword: 'Forgot password',
		reset: 'Reset'
	},
	errors: {
		catchAll: 'Something went wrong...',
		unauthorized: 'Unauthorized to be here 🤨'
	}
};
