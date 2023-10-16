import { config } from 'dotenv';

config()

const getEnvVariable = (key) => {
    const value = process.env[key]
    if(!value) {
        throw new Error(`ENVIRONMENT VARIABLE '${key}' NOT SPECIFIED.`)
    }
    return value
}

export default {
    SERVER: {
        PORT: +getEnvVariable('PORT'),
    }
}