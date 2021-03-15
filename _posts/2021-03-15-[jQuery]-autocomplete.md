---
layout: post
title:  "[jQuery] autocomplete"
categories: javascript
comments: true




---

# autocomplete

<br/>

### 1. JS 파일 로드

````javascript
<!-- 필요한 CSS, JS 로드 -->
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
````

<br/>

### 2.기본 구조

````javascript
var auto_source = [ 'apple', 'banana', 'chocolate' ];

$('#autoInputTag').autocomplete({
	source: auto_source
});
````

<br>

### 3.유용한 속성

\- source / minLength / autofocus / select

```javascript
var auto_source = [ 'apple', 'banana', 'chocolate' ];

$('#autoInputTag').autocomplete({
	source: auto_source,
	minLength: 2,
	autoFocus: true,
	select: function (event, ui) { }
});
```

| [**source**](https://api.jqueryui.com/autocomplete/#option-source) | Array/String/Function | autocomplete에 사용할 소스 데이터                            |
| ------------------------------------------------------------ | --------------------- | ------------------------------------------------------------ |
| [**minLength**](https://api.jqueryui.com/autocomplete/#option-minLength) | Integer               | 검색기능을 활성화할 최소 글자 개수 값이 2면, 2글자를 입력해야 검색된다 |
| [**autoFocus**](https://api.jqueryui.com/autocomplete/#option-autoFocus) | boolean               | 소스 데이터에서 검색했을 때 맨 위 데이터에 자동 포커스       |
| [**select**](https://api.jqueryui.com/autocomplete/#event-select) | Function              | autocomplete에서 사용자가 데이터를 선택했을 때 이벤트        |

<br/>

### 4.방법1

목표: 상위 Select 박스에서 선택한 항목에 따라 다른 소스 데이터 바인딩하기

```javascript
var data = {
	'bird': [ 'fly', 'sit', 'tweet', 'sing', 'eat worm' ],
  'dog': [ 'bark', 'run', 'follow', 'sleep' ]
}

$('#action').autocomplete({
	source : data['bird']
});

$('#animal').change(function() {
	var animal = $(this).val();
  $('#action').autocomplete('option', 'source', data[animal]);
});
```

<br/>

### 5.방법 2

목표: input에 검색하는 키워드와 실제 검색 완료했을 때 input에 보여줄 값 분리하기

```javascript
var data = {
	'bird': [ 
 		{ label: 'Fly', value: 'fly' }, 
  		{ label: 'Sit', value: 'sit' },
		{ label: 'Tweet', value: 'tweet' },
 		{ label: 'Sing', value: 'sing' },
 		{ label: 'Eat', value: 'eat worm' }
 	],
 	'dog': [ 
  		{ label: 'Bark', value: 'bark' },
		{ label: 'Run', value: 'run' },
		{ label: 'Follow', value: 'follow' },
		{ label: 'Sleep', value: 'sleep' }
	]
}

$('#action').autocomplete({
	source : data['bird']
});

$('#animal').change(function() {
	var animal = $(this).val();
  $('#action').autocomplete('option', 'source', data[animal]);
});
```

<br/>

### 6. 방법 3

목표: 검색어 완성되는 타이밍에 하단에 문장으로 표시하기 (select 활용안)

```javascript
var data = {
	'bird': [ 
  	{ label: 'Fly', value: 'fly', 'id': 0 }, 
    { label: 'Sit', value: 'sit', 'id': 1 },
    { label: 'Tweet', value: 'tweet', 'id': 2 },
    { label: 'Sing', value: 'sing', 'id': 3 },
    { label: 'Eat', value: 'eat worm', 'id': 4 }
  ],
  'dog': [ 
  	{ label: 'Bark', value: 'bark', 'id': 5 },
    { label: 'Run', value: 'run', 'id': 6 },
    { label: 'Follow', value: 'follow', 'id': 7 },
    { label: 'Sleep', value: 'sleep', 'id': 8 }
	]
}

$('#action').autocomplete({
      source: function (request, response) {
                var term = request.term; // search keyword
                var filteredData = data['bird'].filter(x => (x.label.indexOf(term) >= 0));
                response($.map(filteredData, function (item) {
                    return {
                        label: item.label,
                        value: item.value,
                        'data-id': item.id
                    }
                }))
            },
    autoFocus: true,
    select: function(event, ui) {
        $('#sentence').text(`${ui.item['data-id']} ${ui.item.value}`);
  }
});

$('#animal').change(function() {
	var animal = $(this).val();
  var source = data[animal];
  $('#action').autocomplete('option', 'source', function (request, response) {
  							var term = request.term; // search keyword
                var filteredData = source.filter(x => (x.label.indexOf(term) >= 0));
                response($.map(filteredData, function (item) {
                    return {
                        label: item.label,
                        value: item.value,
                        'data-id': item.id
                    }
                }))
            });
});
```

<br/>

### 7. 방법 4

 id를 기준으로 autocomplete 기능을 선언 해줍니다.

````javascript
$("#testInput").autocomplete({
        source : function(request, response) {
            $.ajax({
                  url : "/get/test"
                , type : "GET"
                , data : {keyWord : $("#testInput").val()} // 검색 키워드
                , success : function(data){ // 성공
                    response(
                        $.map(data, function(item) {
                            return {
                                  label : item.testNm    //목록에 표시되는 값
                                , value : item.testNm    //선택 시 input창에 표시되는 값
                                , idx : item.testIdx    // db 인덱스를 담을수 있음 
                            };
                        })
                    );    //response
                }
                ,
                error : function(){ //실패
                    alert("통신에 실패했습니다.");
                }
            });
        }
        , minLength : 1    
        , autoFocus : false    
        , select : function(evt, ui) {
            console.log("전체 data: " + JSON.stringify(ui));
            console.log("db Index : " + ui.item.idx);
            console.log("검색 데이터 : " + ui.item.value);
        }
        , focus : function(evt, ui) {
            return false;
        }
        , close : function(evt) {
        }
    });
````

※ 이벤트 설명

\- source : input 필드에 타이핑시 동작합니다.

\- minLength : 조회를 위한 최소 글자수입니다.

\- autoFocus : 첫번째 항목 자동 포커스(기본값 : false)

\- select : 검색 리스트에서 해당 필드 선택시 select 이벤트가 발생합니다.

\- focus : 한글 오류 방지입니다.

\- close : 리스팅 창이 닫힐때 발생하는 이벤트 입니다.

<br/>

