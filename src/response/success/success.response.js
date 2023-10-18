import {cleanData} from "../../utils/lodash.utils.js";

const SuccessStatusCode = {
    OK: 200,
    CREATED: 201,
}

const SuccessReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created successfully',
}

export class SuccessResponse {
    constructor({message = SuccessReasonStatusCode.OK, statusCode = SuccessStatusCode.OK, data = {}}) {
        this.message = message
        this.status = statusCode
        this.data = data
    }


    send(res, headers= {}) {
        return res.status(this.status).json(cleanData(this))
    }
}

export class OkResponse extends SuccessResponse {
    constructor({ message = SuccessReasonStatusCode.OK, data }) {
        super({ message, statusCode: SuccessStatusCode.OK, data })
    }
}

export class CreatedResponse extends SuccessResponse {
    constructor({ message = SuccessReasonStatusCode.CREATED, data }) {
        super({ message, statusCode: SuccessStatusCode.CREATED, data })
    }
}
