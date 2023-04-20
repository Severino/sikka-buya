import Compare from "./Compare.mjs";

export default class Async {
    static sleep(seconds) {
        return new Promise((r) => setTimeout(r, seconds));
    }
}

/**
 * A RequestGuard will receive a function that executes a request.
 * 
 * It immediately executes the initial request and also
 * executes the last request send, after it finalized the first,
 * while ignoring all requests done inbetween. 
 */
export class RequestGuard {
    constructor(callback, {
        before = null,
    } = {}) {
        if (!callback || typeof callback !== "function")
            throw new Error(`RequestGuard requires a callback function, got ${typeof callback}.`)

        this.reqCount = 0
        this.current = 0
        this.locked = false
        this.value = null
        this.before = before
        this.callback = callback
    }

    /**
     * Executes a function as long as the requestCount
     * is different from the previous requestNumber.

     *  
     */
    async exec(value) {
        this.reqCount++
        let returnValue = null
        this.value = value
        if (!this.locked) {
            do {
                this.locked = true
                let current = this.reqCount
                let value = this.value

                if(this.before) this.before(value)

                try {
                    console.log(`RequestGuard starts processing ${current}.`)
                    returnValue = await this.callback(value)
                } catch (e) {
                    console.error(e)
                } finally {
                    console.log(`RequestGuard finished request ${current}.`, value.filters.yearOfMint)
                    if (this.reqCount > current) console.log(`RequestGuard queued request ${this.reqCount}.`)
                    this.current = current
                    this.locked = false
                }
            } while (this.reqCount > this.current && !Compare.deep(this.value, value, 12))

            /**
             * When equilibrium is reached, we can reset the 
             * variables to prevent overflow.
             */
            this.reqCount = 0
            this.current = 0
            return returnValue
        } else {
            console.log("RequestGuard is locked, the request was queued.", this.reqCount, this.value)
        }
        return null
    }

}

export class Timeout {
    constructor() {
        this.timeout = null
    }

    async set(callback, ms) {
        if (this.timeout !== null) throw new Error("Timeout already set! Maybe you missed to clear it?")
        this.timeout = setTimeout(callback, ms)
    }

    clear() {
        clearTimeout(this.timeout)
        this.timeout = null
    }
}
