const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const sayHello = require("./hello_grpc");

var PROTO_PATH = __dirname + "/helloworld.proto";
const HOST = "127.0.0.1";
const PORT = "65121";
const TARGET = `${HOST}:${PORT}`;

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    /* empty options */
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
    var server = new grpc.Server();
    server.addService(hello_proto.Greeter.service, { sayHello: sayHello });
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}

main();
