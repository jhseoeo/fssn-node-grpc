const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/clientstreaming.proto";
const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;

function cleintStreamingService(call, callback) {
    console.log("Server processing gRPC client-streaming.");
    let count = 0;

    call.on("data", async (data) => {
        count++;
    });

    call.on("end", async (data) => {
        callback(null, { value: count });
    });
}

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const clientStreamingStub = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition)
                .clientstreaming;
        });

    // gRPC Server 생성
    const server = new grpc.Server();
    // gRPC Server에 service 추가함
    server.addService(clientStreamingStub.ClientStreaming.service, {
        GetServerResponse: cleintStreamingService,
    });
    // 서버 바인드 및 시작
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Starting server. Listening on port ${PORT}`);
    });
}

main();
