export const errorMiddleware = (error, req, res, next) => {
    res.status(400).send({
        status:error.name,
        message:error.message,
        cause:error.cause
    })
}