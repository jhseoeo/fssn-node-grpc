const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/bidirectional.proto";
const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;

function bidirectionalService(call) {
    console.log("Server processing gRPC bidirectional streaming.");
    call.on("data", async (data) => {
        call.write(data);
    });

    call.on("end", async (data) => {
        call.end();
    });
}

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const bidirectionalStub = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition).bidirectional;
        });

    // gRPC Server 생성
    const server = new grpc.Server();
    // gRPC Server에 service 추가함
    server.addService(bidirectionalStub.Bidirectional.service, {
        GetServerResponse: bidirectionalService,
    });
    // 서버 바인드 및 시작
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Starting server. Listening on port ${PORT}`);
    });
}

main();
