function sayHello(call, callback) {
    // 첫번째 parameter의 null은 오류가 발생하지 않았음을 나타냄
    callback(null, { value: Math.floor(Math.random() * call.request.value) });
}

module.exports = sayHello;
