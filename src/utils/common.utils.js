function dateToNumber(date) {
    return new Date(date).getTime();
}

const longTimestampsPlugin = function(schema, options) {
    schema.add({
        createdAt: {
            type: Number,
            default: Date,
            set: dateToNumber,
        },
        updatedAt: {
            type: Number,
            default: Date,
            set: dateToNumber,
        },
    });

}
const asyncHandler = (handler) => {
    return (req, res, next) => {
        handler(req, res, next).catch(next)
    }
}

export {
    dateToNumber,
    longTimestampsPlugin,
    asyncHandler
}
