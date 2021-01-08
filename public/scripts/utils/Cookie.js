export default class Cookie {
    get(name, cookiesString = document.cookie) {
        const cookies = cookiesString.split(';').map(cookie => {
            const [name, ...value] = cookie.split('=')
            return { [name.trim()]: decodeURIComponent(value.join('=')) }
        })
        
        return cookies[name] ?? cookies[0][name]
    }

    set(name, value, opts = {}) {
        if (opts.days) {
            opts['max-age'] = opts.days * 60 * 60 * 24
            delete opts.days
        }
        opts = Object.entries(opts).reduce(
            (accumulatedStr, [k, v]) => `${accumulatedStr}; ${k}=${v}`, ''
        )

        document.cookie = `${name}=${encodeURIComponent(value) + opts}`
    }

    delete(name) {
        this.set(name, '', { 'max-age': -1 })
    }
}
