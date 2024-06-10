export const errorHandler = (statusCode, message, err)=>{
    const error = new Error(message);
    error.statusCode = statusCode || 500;
    error.error = err || undefined;

    // console.log('in',error);

    return error;
}