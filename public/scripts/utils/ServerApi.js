import nodeFetch from 'node-fetch'

export default class ServerApi {
    constructor(data) {
        this.data = data
    }

    async whoAmI() {
        const response = await nodeFetch('https://carstats-backend.herokuapp.com/users/me', {
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
