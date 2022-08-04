class Async {
    static sleep(seconds) {
        return new Promise((r) => setTimeout(r, seconds));
    }
}

class RequestGuard {
    constructor() {
        this.reqCount = 0
        this.current = 0
        this.locked = false
        this.value = null
    }

    /**
     * Executes a function as long as the requestCount
     * is different from the previous requestNumber.
     */
    async exec(callback, value) {
        this.reqCount++
        let returnValue = null
        this.value = value
        if (!this.locked) {
            do {
                this.locked = true
                let current = this.reqCount
                try {
                    returnValue = await callback(this.value)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.current = current
                    this.locked = false
                }
            } while (this.reqCount > this.current && this.value != value)

            /**
             * When equilibrium is reached, we can reset the 
             * variables to prevent overflow.
             */
            this.reqCount = 0
            this.current = 0
        }
        return returnValue

    }

}

Async.RequestGuard = RequestGuard

module.exports = Async
