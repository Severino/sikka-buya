export default class RequestBuffer {
    constructor(blockTime, allowSame = false) {
        this.blockTime = blockTime
        this.timeout = null
        this.lastTimestamp = null
        this.nextValue = null
        this.allowSame = allowSame

        this._set = this._set.bind(this)
    }

    _set(value, callback) {
        callback(value)
        this.lastTimestamp = Date.now()
    }

    update(value, callback) {

        /**
         * Skip update when the values are the same
         */
        if (!this.allowSame && this.nextValue == value) return
        else this.nextValue = value

        this.resetTimeout()

        const diff = Date.now() - this.lastTimestamp

        if (diff > this.blockTime) this._set(value, callback)
        else { this.timeout = setTimeout(this._set.bind(this, value, callback), this.blockTime - diff) }
    }

    resetTimeout() {
        clearTimeout(this.timeout)
        this.timeout = null
    }
}