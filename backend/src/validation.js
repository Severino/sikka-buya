class ValidationRule {
    constructor(errorMessage) {
        this.errorMessage = errorMessage
    }

    validate() { console.error("Don't call this method directly. Its abstract and should be overloaded.") }
}

class RegExValidationRule extends ValidationRule {
    constructor(regex, errorMessage) {
        super(errorMessage)
        this.regex = regex
    }

    validate(string) {
        if(!string) throw new Error("The 'string' parameter must be passed.")
        return new Validation(string.match(this.regex), this.errorMessage)
    }
}

class Validation {
    constructor(valid, message) {
        this.valid = valid
        this.message = message
    }

    get ok() {
        return this.valid
    }

    get error() {
        return (this.ok) ? "" : this.message
    }
}

module.exports = {
    Validation,
    ValidationRule,
    RegExValidationRule
}