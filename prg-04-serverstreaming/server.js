const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/serverstreaming.proto";
const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;

function serverStreamingService(call) {
    const messages = [
        { message: "message #1" },
        { message: "message #2" },
        { message: "message #3" },
        { message: "message #4" },
        { message: "message #5" },
    ];

    console.log(
        "Server processing gRPC server streaming " + call.request.value + "."
    );
    messages.forEach((v) => {
        call.write(v);
    });

    call.end();
}

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const serverStreamingStub = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition)
                .serverstreaming;
        });

    // gRPC Server 생성
    const server = new grpc.Server();
    // gRPC Server에 service 추가함
    server.addService(serverStreamingStub.ServerStreaming.service, {
        GetServerResponse: serverStreamingService,
    });
    // 서버 바인드 및 시작
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Starting server. Listening on port ${PORT}`);
    });
}

main();
