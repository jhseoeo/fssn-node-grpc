const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;
const PROTO_PATH = __dirname + "/clientstreaming.proto";

async function send_messages(clientStream) {
    const messages = [
        { message: "message #1" },
        { message: "message #2" },
        { message: "message #3" },
        { message: "message #4" },
        { message: "message #5" },
    ];
    messages.forEach((message) => {
        console.log(`[client to server] ${message.message}`);
        clientStream.write(message);
    });
    clientStream.end();
}

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const hello_proto = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition)
                .clientstreaming;
        });

    // gRPC 클라이언트 생성
    const client = new hello_proto.ClientStreaming(
        TARGET,
        grpc.credentials.createInsecure()
    );

    const clientStream = client.GetServerResponse((err, response) => {
        if (!err) console.log("[server to client] ", response.value);
    });

    send_messages(clientStream);
}

main();
