# 2022-1 FullStack Network Service Project

> Implementing gRPC examples on Node.js
> 2018102198 컴퓨터공학과 서준혁

#### 선택 언어

-   Javascript(Node.js)

#### 실행 방법

1. 각각의 예제 폴더(`prg-01-hello_gRPC`, `prg-02-bidirectional-streaming`, `prg-03-clientstreaming`, `prg-04-serverstreaming`)에 접근합니다.
2. `server.js`를 실행합니다.

```sh
node server.js
```

3. `client.js` 파일을 실행합니다.

```sh
node client.js
```

#### python 예제와 차이점

-   Python 예제는 protobuf compiler를 통해 message 및 client/server class들을 생성하였습니다.
    Node.js에서도 마찬가지로 protobuf compiler를 사용할 수 있었으나, dynamic .proto loader가 존재하여 이를 사용해 보았습니다.

-   Python 예제에서는 Streaming시 `yield`를 통해 list 형태의 데이터를 전송하였으며, 수신단에서는 이를 하나의 list처럼 처리할 수 있었습니다.
    반면 Node.js에서는 연결된 connection에 연속적인 데이터를 write하여 streaming을 할 수 있었으며, Streaming 수신단에서는 이벤트를 bind하여, streaming되는 각각의 데이터가 도착할 때마다 해당 데이터를 핸들링할 수 있었습니다.

#### 실행 영상

1. Unary

    >   <img width="800" src="https://raw.githubusercontent.com/junhyuk0801/fssn-node-grpc/main/prg-01-hello_gRPC/1-unary.gif"/>

2. Bidirectional Streaming

    >   <img width="800" src="https://raw.githubusercontent.com/junhyuk0801/fssn-node-grpc/main/prg-02-bidirectional-streaming/2-bidirectional.gif"/>

3. Client Streaming

    >   <img width="800" src="https://raw.githubusercontent.com/junhyuk0801/fssn-node-grpc/main/prg-03-clientstreaming/3-clientstreaming.gif"/>

4. Server Streaming
    >   <img width="800" src="https://raw.githubusercontent.com/junhyuk0801/fssn-node-grpc/main/prg-04-serverstreaming/4-serverstreaming.gif"/>

#### 결론

동기 방식인 파이썬에 대비했을 때, 자바스크립트는 비동기이면서 event-driven입니다. 이 때문에 RPC의 호출 흐름과 streaming 데이터를 받았을 때마다 이벤트로 처리한다는 점이 처음에는 이해가 되지 않았습니다. 이러한 호출 흐름을 이해하는 과정에서 꽤 시간이 걸렸던 것 같고, 많은 자료들을 찾아봤던 것 같습니다.

unary나 bidirectional 통신의 경우 자료의 양이 비교적 많았으나, client및 server streaming의 경우 참고할 만한 자료가 부족한 편이었습니다. 그래서 이 경우 자료를 먼저 찾기보단, unary 및 bidrectional 예제 코드를 참조하여 streaming 수신단 및 서비스에 맞게 코드를 직접 작성해보았습니다. 자잘한 에러가 발생했지만 결과적으로는 이들을 모두 해결한 뒤에는 정상적으로 실행이 되었습니다.

개인적인 생각이지만, Node.js에서의 gRPC는(특히 unary의 경우) RPC의 의도대로 함수를 호출하는 것처럼 데이터를 주고받는다는 느낌보다는, 일반적인 데이터 통신과 별반 다를 바가 없다는 느낌이 들었습니다. 이는 서버 또는 클라이언트 단에서 데이터를 받았을 때 처리하는 방식이 event binding 및 callback 호출을 통해 진행되기 때문이라고 생각합니다. 반면 streaming의 경우 연속적인 데이터를 전송할 때 유용하게 사용할 수 있을 것 같다는 느낌이 들었습니다.

이후 계획으로는 방학 중에 Go를 이용하여 본 gRPC 예제를 다시 한번 설계 또는 gRPC를 이용한 토이프로젝트를 진행해 볼 계획입니다.
