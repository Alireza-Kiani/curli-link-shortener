interface ErrorType {
    code: number,
    message: string
}

export default class ErrorHandler {

    public error: ErrorType | string | undefined;

    constructor(error: ErrorType | string | undefined) {
        this.error = error;
    }
}