import nodeFetch from 'node-fetch'

export default class ServerApi {
    constructor(data) {
        this.data = data
    }

    async whoAmI() {
        const response = await nodeFetch('http://localhost:1337/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.data.bearer}`
            },
            redirect: 'follow'
        })
        return await response.json()
    }
}
