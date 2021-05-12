---
layout: post
title:  "[java] Socket"
categories: java
comments: true





---

# Socket

### Socket ?

소켓 프로그래밍은 소켓을 이용한 통신 프로그래밍을 뜻하는데, 소켓이란 프로세스간의 통신에 사용되는 양쪽 끝단(endPoint)을 의미한다. 프로세스간의 통신을 위해서는 무언가가 필요하고 이것이 소켓이다.

- 소켓 → 프로토콜, ip주소, 포트넘버로 정의 됨.
- 떨어져 있는 두 호스트를 연결해주는 도구로써 인터페이스 역할.
- 데이터를 주고 받을 수 있는 구조체로 소켓을 통해 데이터 통로가 만들어 진다.
- 소켓의 역할에 따라 클라이언트 소켓, 서버소켓으로 구분된다.

### TCP

- 양방향으로 바이트 스트림을 전송, 연결 지향성
- 오류 수정, 전송 처리, 흐름제어 보장
- 송신된 순서에 따라 중복되지 않게 데이터를 수신 → 오버헤드 발생
- 소량의 데이터보다 대량의 데이터에 적합

### UDP

- 비연결형 소켓
- 데이터의 크기에 제한이 있음.
- 확실하게 전달이 보장되지 않음. → 데이터가 손실되도 오류 발생 안됨.
- 실시간 멀티미디어 정보를 처리하기 위해 주로 사용 → 전화



### **Server Socket API**

ServerSocket의 클래스는 서버 프로그램을 구현하는데 사용됩니다. 
일반적인 서버 프로그램의 과정은 Step1 ~ Step 6으로 나눌 수 있습니다.

 <br/>

**Step 1. 서버 소켓 생성, 포트 바인딩**

**Step 2. 클라이언트로부터의 연결을 기다리고(Connect Listen) 요청이 오면 수락**

**Step 3. 클라이언트 소켓에서 가져온 InputStream(클라이언트 쪽에서는 OuputStream 이 됩니다)을 읽음**

**Step 4. 응답이 있다면 OutputStream을 통해 클라이언트에 데이터를 보냄**

**Step 5. 클라이언트와의 연결을 닫음**

**Step 6. 서버 종료**

사용 목적이나 용도에 따라서 3~4단계는 반복 될 수 있습니다.

 <br/>

설명드릴 통신의 순서는 

> Create a Server Socket 
> Listen for a connection 
> Read data from the client 
> Send Data to the Client 
> Close the client Connection 
> Terminate the Server

입니다.

<br/>

#### Step 1. Create a Server Socket

다음 생성자 중 하나를 사용하여 ServerSocket 클래스의 새 객체를 만듭니다.

![img1 daumcdn](https://user-images.githubusercontent.com/38201897/117928675-d77f9280-b336-11eb-89e3-e19aa1f79350.png)



-ServerSocket(int port) : 지정된 포트 번호에 바인딩 된 서버 소켓을 만듬 (연결 대기열 최대 수 50)

\- ServerSocket(int port, int backlog): 지정된 포트 번호에 바인드 된 서버 소켓을 만들고 대기중인 최대 연결 수를 backlog 매개변수로 지정

\- ServerSocket(int port, int backlog, InetAddress bindAddr) : 서버 소켓을 만들고 지정된 포트 번호와 로컬 IP 주소에 바인딩

 간단한 사용 예 입니다. 서버 소켓을 포트번호 8000에 바인딩하는 예 입니다.

````java
ServerSocket serverSocket = new ServerSocket(8000);
````



이러한 생성자는 소켓을 열 때 I/O Exception이 일어 날 수 있기 때문에 고려 해 주어야 합니다.

<br/>

 

#### Step 2. Listen for a connection

 

연결 수신의 예 입니다.

```java
Socket socket = serverSocket.accept();
```

 <br/>

#### Step 3. Read data from the Client

 

Socket 객체가 반환 되면 (연결이 되면) InputStream을 사용하여 클라이언트에서 보낸 데이터를 읽을 수 있습니다.

```java
InputStream input = socket.getInputStream();
```

 

InputStream은 데이터를 byte 배열로 읽기 때문에, 상위 레벨의 데이터를 읽으려면 **InputStreamReader로** 읽어줍니다.

```java
InputStreamReader reader = new InputStreamReader(input);
int character = reader.read();  // reads a single character
```

 

또한 **BufferedReader**에 InputStream을 래핑하여 데이터를 String으로 읽어옵니다.

```java
BufferedReader reader = new BufferedReader(new InputStreamReader(input));
String line = reader.readLine();    // reads a line of text
```

 <br/>

#### Step 4. Send Data to the client

 

Socket과 연결 된 클라이언트에게 **OutputStream**을 사용하여 데이터를 보냅니다.

```java
OutputStream output = socket.getOutputStream();
```

 

PintWriter를 사용하여 텍스트 형식으로 데이터를 보낼 수 있습니다.

```java
PrintWriter writer = new PrintWriter(output, true);
writer.println(“This is a message sent to the server”);
```

 <br/>

#### Step 5. Close the client Connection

 

Socket 통신이 완료 되면, close() 메서드를 사용하여 클라이언트와의 연결을 종료합니다.

```java
socket.close();
```

**close()** 메서드는 소켓의 **InputStream**과 **OutputStream**을 닫아 주는 역할을 합니다.

 

 <br/>

#### Step 6. Terminate the Server

 

서버는 클라이언트에서 들어오는 요청을 기다리며 항상 실행되어 있어야 합니다.

서버를 중지 해야 하는 경우에는 ServerSocket 인슽턴스의 close() 메서드를 호출하여 서버를 종료 해 줍니다.

Client Connection을 종료하는 메서드와 명칭이 같지만, **Client와의 연결을 끊는 것이 아니라 "서버"를 중지하는 역할**을 합니다.

```java
serverSocket.close();
```

 <br/>

### **Java Server Socket Example**

\- **Client** 코드

```java
package com.woolbro.dev.socket.Client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;

public class TimeClient {

    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("#######Need More Arguments #########");
            return;
        }

        String hostname = args[0];
        int port = Integer.parseInt(args[1]);
        for (int i = 0; i < 10; i++) {
            try (Socket socket = new Socket(hostname, port)) {
                OutputStream out = socket.getOutputStream();
                String realStr = "This is woolbro dev Test";
                out.write(realStr.getBytes());
                InputStream input = socket.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(input));

                String time = reader.readLine();

                System.out.println(time);

            } catch (UnknownHostException ex) {

                System.out.println("Server not found: " + ex.getMessage());

            } catch (IOException ex) {

                System.out.println("I/O error: " + ex.getMessage());
            }
        }

    }

}
```

 

\- **Server** 코드

 

```java
package com.woolbro.dev.socket.Server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

public class TimeServer {

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("######## Argument is Null ########");
            return ;
        }
        
        int port = Integer.parseInt(args[0]);
 
        try (ServerSocket serverSocket = new ServerSocket(port)) {
 
            System.out.println("Server is listening on port " + port);
 
            while (true) {
                Socket socket = serverSocket.accept();
 
                System.out.println("[ "+socket.getInetAddress()+" ] client connected");
                OutputStream output = socket.getOutputStream();
                PrintWriter writer = new PrintWriter(output, true);
                writer.println(new Date().toString());

                InputStream input = socket.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(input));
                System.out.println("###### msg : "+reader.readLine());
            }
 
        } catch (IOException ex) {
            System.out.println("Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }

    }

}
```

 <br/>

<br/>

reference

https://woolbro.tistory.com/29

https://mainpower4309.tistory.com/25?category=774615

https://cbts.tistory.com/84

https://wonos.tistory.com/388