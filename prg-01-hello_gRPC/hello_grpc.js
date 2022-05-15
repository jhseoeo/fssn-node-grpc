function sayHello(call, callback) {
    callback(null, { message: "Hello " + call.request.name });
}

module.exports = sayHello;
