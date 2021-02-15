# Ajax

웹브라우저는 대단히 정적인 시스템이었다. 내용이 바뀌면 페이지 새로고침을 해서 내용을 새롭게 변경해야 했다. 이것은 웹이 전자 문서를 염두에 두고 고안된 시스템이기 때문에 당연하게 생각 되었다. 

그러다 Ajax 개념이 도입되면서 모든 것이 바뀌었다. Ajax는 웹브라우저와 웹서버가 내부적으로 데이터 통신을 하게 된다. 그리고 변경된 결과를 웹페이지에 프로그래밍적으로 반영함으로써 **웹페이지의 로딩 없이 서비스를 사용**할 수 있게 한다. 

Ajax는 Asynchronous JavaScript and XML의 약자다. 한국어로는 비동기적 자바스크립트와 XML 정도로 직역할 수 있는데 **자바스크립트를 이용해서 비동기적으로 서버와 브라우저가 데이터를 주고 받는 방식을 의미한다**. 이 때 사용하는 API가 XMLHttpRequest이다. 그렇다고 꼭 XML을 사용해서 통신해야 하는 것은 아니다. 사실 XML 보다는 JSON을 더 많이 사용한다.

### 

### $.ajax() 메소드

----------------------

#### 제이쿼리와 Ajax

Ajax를 이용하여 개발을 손쉽게 할 수 있도록 미리 여러 가지 기능을 포함해 놓은 개발 환경을 Ajax 프레임워크라고 합니다.

그중에서도 현재 가장 널리 사용되고 있는 Ajax 프레임워크는 바로 제이쿼리(jQuery)입니다.

-------------------------------------

#### $.ajax() 메소드

제이쿼리는 Ajax와 관련된 다양하고도 편리한 메소드를 많이 제공하고 있습니다.

 

그중에서도 $.ajax() 메소드는 모든 제이쿼리 Ajax 메소드의 핵심이 되는 메소드입니다.

$.ajax() 메소드는 HTTP 요청을 만드는 강력하고도 직관적인 방법을 제공합니다.

$.ajax() 메소드의 원형은 다음과 같습니다.

```+jQUery
$.ajax([옵션])
```

URL 주소는 클라이언트가 HTTP 요청을 보낼 서버의 주소입니다.

옵션은 HTTP 요청을 구성하는 키와 값의 쌍으로 구성되는 헤더의 집합입니다.

 

다음 예제는 $.ajax() 메소드에서 사용할 수 있는 대표적인 옵션을 설명하는 예제입니다.

```+jQuery
$.ajax({

    url: "/examples/media/request_ajax.php",//클라이언트가 요청을 보낼 서버의 URL 주소

    data: { name: "MyName" },                // HTTP 요청과 함께 서버로 보낼 데이터

    type: "GET",                             // HTTP 요청 방식(GET, POST)

    dataType: "json"                         // 서버에서 보내줄 데이터의 타입

})

// HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.

.done(function(json) {

    $("<h1>").text(json.title).appendTo("body");

    $("<div class=\"content\">").html(json.html).appendTo("body");

})

// HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.

.fail(function(xhr, status, errorThrown) {

    $("#text").html("오류가 발생했습니다.<br>")

    .append("오류명: " + errorThrown + "<br>")

    .append("상태: " + status);

})

// HTTP 요청이 성공하거나 실패하는 것에 상관없이 언제나 always() 메소드가 실행됨.

.always(function(xhr, status) {

    $("#text").html("요청이 완료되었습니다!");

});
```

다음 예제는 $.ajax() 메소드의 동작을 보여주는 간단한 예제입니다.

```+jQuery
$(function() {

    $("#requestBtn").on("click", function() {

        $.ajax("/examples/media/request_ajax.php")

        .done(function() {

            alert("요청 성공");

        })

        .fail(function() {

            alert("요청 실패");

        })

        .always(function() {

            alert("요청 완료");

        });

    });

});
```





### Ajax 메소드

-------------------------------------

#### $.ajax() 메소드

제이쿼리는 Ajax와 관련된 다양하고도 편리한 많은 메소드를 제공합니다.

 

그중에서도 $.ajax() 메소드는 모든 제이쿼리 Ajax 메소드의 핵심이 되는 메소드입니다.

$.ajax() 메소드는 HTTP 요청을 만드는 강력하고도 직관적인 방법을 제공합니다.

 

$.ajax() 메소드의 원형은 다음과 같습니다.

```+jQuery
$.ajax(URL주소[,옵션])
```



URL 주소는 클라이언트가 HTTP 요청을 보낼 서버의 주소입니다.

옵션은 HTTP 요청을 구성하는 키와 값의 쌍으로 구성되는 헤더의 집합입니다.

 

다음 예제는 $.ajax() 메소드에서 사용할 수 있는 대표적인 옵션을 설명하는 예제입니다.

```+jQuery
$.ajax({

    url: "/examples/media/request_ajax.php", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소

    data: { name: "홍길동" },                          // HTTP 요청과 함께 서버로 보낼 데이터

    method: "GET",                                     // HTTP 요청 방식(GET, POST)

    dataType: "json"                                   // 서버에서 보내줄 데이터의 타입

})

// HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.

.done(function(json) {

    $("<h1>").text(json.title).appendTo("body");

    $("<div class=\"content\">").html(json.html).appendTo("body");

})

// HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.

.fail(function(xhr, status, errorThrown) {

    $("#text").html("오류가 발생했습니다.<br>")

    .append("오류명: " + errorThrown + "<br>")

    .append("상태: " + status);

})

// HTTP 요청이 성공하거나 실패하는 것에 상관없이 언제나 always() 메소드가 실행됨.

.always(function(xhr, status) {

    $("#text").html("요청이 완료되었습니다!");

});
```

다음 예제는 $.ajax() 메소드의 동작을 보여주는 간단한 예제입니다.

````+jQuery
$(function() {

    $("#requestBtn").on("click", function() {

        $.ajax("/examples/media/request_ajax.php")

        .done(function() {

            alert("요청 성공");

        })

        .fail(function() {

            alert("요청 실패");

        })

        .always(function() {

            alert("요청 완료");

        });

    });

});
````



------------------------



#### load() 메소드

load() 메소드는 선택한 요소에서 호출하는 유일한 제이쿼리 Ajax 메소드입니다.

 

load() 메소드는 서버에서 데이터를 읽은 후, 읽어 들인 HTML 코드를 선택한 요소에 배치합니다.

또한, 선택자를 URL 주소와 함께 전송하면, 읽어 들인 HTML 코드 중에서 선택자와 일치하는 요소만을 배치합니다.



````+jQuery
$(function() {

    $("#requestBtn").on("click", function() {

        // URL 주소에 존재하는 HTML 코드에서 <li>요소를 읽은 후에 id가 "list"인 요소에 배치함.

        $("#list").load("/examples/tryit/htmlexample/jq_elementTraversing_etc_01.html li");

    });

});
````





#### Ajax 메소드

제이쿼리는 $.ajax() 메소드뿐만 아니라 Ajax와 관련된 다양한 메소드를 제공하고 있습니다.

|    메소드     |                             설명                             |
| :-----------: | :----------------------------------------------------------: |
|   $.ajax()    |         비동기식 Ajax를 이용하여 HTTP 요청을 전송함.         |
|    $.get()    |        전달받은 주소로 GET 방식의 HTTP 요청을 전송함.        |
|   $.post()    |       전달받은 주소로 POST 방식의 HTTP 요청을 전송함.        |
| $.getScript() |                웹 페이지에 스크립트를 추가함.                |
|  $.getJSON()  | 전달받은 주소로 GET 방식의 HTTP 요청을 전송하여, 응답으로 JSON 파일을 전송받음. |
|    .load()    | 서버에서 데이터를 읽은 후, 읽어 들인 HTML 코드를 선택한 요소에 배치함. |

