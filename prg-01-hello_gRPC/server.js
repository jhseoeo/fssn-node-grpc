const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");
// 실행할 함수
const myFunc = require("./hello_grpc");

const PROTO_PATH = __dirname + "/hello_grpc.proto";
const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const hello_proto = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition);
        });

    // gRPC Server 생성
    const server = new grpc.Server();
    // gRPC Server에 service 추가함
    server.addService(hello_proto.MyService.service, { MyFunction: myFunc });
    // 서버 바인드 및 시작
    server.bindAsync(TARGET, grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log(`Starting server. Listening on port ${PORT}.`);
    });
}

main();
