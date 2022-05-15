const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const HOST = "127.0.0.1";
const PORT = "65121";
const TARGET = `${HOST}:${PORT}`;
const PROTO_PATH = __dirname + "/helloworld.proto";

async function main() {
    const hello_proto = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition).helloworld;
        });

    const client = new hello_proto.Greeter(
        TARGET,
        grpc.credentials.createInsecure()
    );

    client.sayHello({ name: "Junhyuo Seo" }, function (err, response) {
        console.log("Greeting:", response.message);
    });
}

main();
