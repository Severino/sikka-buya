class ValidationRule {
    constructor(errorMessage) {
        this.errorMessage = errorMessage
    }

    validate() { console.error("Don't call this method directly. Its abstract and should be overloaded.") }
}

class FunctionValidationRule extends ValidationRule {
    constructor(func, errorMessage) {
        super(errorMessage)
        this.func = func
    }

    validate(...args) {
        return new Validation(this.func(...args), this.errorMessage)
    }
}

class RegExValidationRule extends ValidationRule {
    constructor(regex, errorMessage) {
        super(errorMessage)
        this.regex = regex
    }

    validate(string) {
        if (!string) return false
        return new Validation(string.match(this.regex), this.errorMessage)
    }
}

class Validation {
    constructor(valid, message) {
        this.valid = valid
        this.message = message
    }

    get failed(){
        return !this.valid
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
    RegExValidationRule,
    FunctionValidationRule
}