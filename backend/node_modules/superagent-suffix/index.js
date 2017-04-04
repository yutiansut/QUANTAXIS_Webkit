module.exports = function suffixInitiator(suffix) {
    return function suffixMiddleware(request) {
        request.url += suffix;
        return request;
    };
}
