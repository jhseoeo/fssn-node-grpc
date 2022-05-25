const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;
const PROTO_PATH = __dirname + "/serverstreaming.proto";

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const hello_proto = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition)
                .serverstreaming;
        });

    // gRPC 클라이언트 생성
    const client = new hello_proto.ServerStreaming(
        TARGET,
        grpc.credentials.createInsecure()
    );
    const serverStream = client.GetServerResponse({ value: 5 });

    // rpc 호출 후, 호출 결과를 callback으로 받아 출력함
    // { value: 4 }는 myNumber로 casting됨
    serverStream.on("data", (res) => {
        console.log(`[server to client] ${res.message}`);
    });
}

main();
