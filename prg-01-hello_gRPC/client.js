const grpc = require("@grpc/grpc-js");
// dynamic .proto loader
const protoLoader = require("@grpc/proto-loader");

const HOST = "127.0.0.1";
const PORT = "50051";
const TARGET = `${HOST}:${PORT}`;
const PROTO_PATH = __dirname + "/hello_grpc.proto";

async function main() {
    // dynamic .proto loader를 통해 .proto 읽어옴 => stub
    const hello_proto = await protoLoader
        .load(PROTO_PATH, {
            /* empty options */
        })
        .then((packageDefinition) => {
            return grpc.loadPackageDefinition(packageDefinition);
        });

    // gRPC 클라이언트 생성
    const client = new hello_proto.MyService(
        TARGET,
        grpc.credentials.createInsecure()
    );

    // rpc 호출 후, 호출 결과를 callback으로 받아 출력함
    // { value: 4 }는 myNumber로 casting됨
    client.MyFunction({ value: 4 }, function (err, response) {
        if (!err) console.log("gRPC result:", response.value);
    });
}

main();
