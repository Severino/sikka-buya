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
    constructor(callback) {
        if (!callback || typeof callback !== "function")
            throw new Error(`RequestGuard requires a callback function, got ${typeof callback}.`)

        this.reqCount = 0
        this.current = 0
        this.locked = false
        this.value = null
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
                try {
                    returnValue = await this.callback(this.value)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.current = current
                    this.locked = false
                }
            } while (this.reqCount > this.current && !Compare.deep(this.value, value, 6))

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

