
class AxiosHelper {

    static ok(result) {
        if (result.data.errors && result.data.errors.length > 0) {
            return false
        } else return true
    }


    static getErrors(result) {
        let errors = [];
        if (result.data.errors && result.data.errors.length > 0) {
            errors = result.data.errors.map(errObj => errObj.message)
        }
        return errors
    }
}

module.exports = AxiosHelper