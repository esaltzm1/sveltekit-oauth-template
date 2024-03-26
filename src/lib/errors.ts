type ErrorName = 'RESEND_API_ERROR';

export class ProjectError extends Error {
	name: ErrorName;
	message: string;
	cause: any;

	constructor(name: ErrorName, message: string, cause: any) {
		super();
		this.name = name;
		this.message = message;
		this.cause = cause;
	}
}
