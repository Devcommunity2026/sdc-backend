class errorClass extends Error {
    constructor(success, statusCode, responseMessage, logMessage, error) {
        super(error?.message)
        this.success = success
        this.statusCode = statusCode
        this.responseMessage = responseMessage
        this.stack = error.stack
        this.logMessage = logMessage
        this.errorMessage = error.message
    }
}
export default errorClass
