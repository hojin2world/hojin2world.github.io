---
layout: post
title:  "[javascript] html2canvas"
categories: javascript
comments: true

---

html2canvas
=============

#### Screenshots with JavaScript

* 사용법은 문서에도 있지만 매우 간단합니다. 캡쳐 하고 싶은 DOM을 `html2canvas()` 함수의 파라미터로 전달해서 호출하면 `Promise` 객체를 리턴받을수 있고 그것을 통해 특정 영역을 포함한 `canvas` 객체를 받을수가 있습니다.

 ##### html

```html
<div id="capture" style="padding: 10px; background: #f5da55">
    <h4 style="color: #000; ">Hello world!</h4>
</div>
```

#####  JavaScript

```javascript
html2canvas(document.querySelector("#capture")).then(canvas => {
    document.body.appendChild(canvas)
});
```

##### Sample code 

```
<!DOCTYPE html>
<html lang="en">
<head>
<title>CSS Template</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<style>
* {
box-sizing: border-box;
}
body {
font-family: Arial, Helvetica, sans-serif;
}
/* Style the header */
header {
background-color: #666;
padding: 30px;
text-align: center;
font-size: 35px;
color: white;
}
/* Create two columns/boxes that floats next to each other */
nav {
float: left;
width: 30%;
height: 300px; /* only for demonstration, should be removed */
background: #ccc;
padding: 20px;
}
/* Style the list inside the menu */
nav ul {
list-style-type: none;
padding: 0;
}
article {
float: left;
padding: 20px;
width: 70%;
background-color: #f1f1f1;
height: 300px; /* only for demonstration, should be removed */
}
/* Clear floats after the columns */
section:after {
content: "";
display: table;
clear: both;
}
/* Style the footer */
footer {
background-color: #777;
padding: 10px;
text-align: center;
color: white;
}
/* Responsive layout - makes the two columns/boxes stack on top of each other instead of next to each other, on small screens */
@media (max-width: 600px) {
nav, article {
width: 100%;
height: auto;
}
}
</style>
</head>
<body>
<input type="button" value="캡쳐" />
<h2>CSS Layout Float</h2>
<p>In this example, we have created a header, two columns/boxes and a footer. On smaller screens, the columns will stack on top of each other.</p>
<p>Resize the browser window to see the responsive effect (you will learn more about this in our next chapter - HTML Responsive.)</p>
<header>
<h2>Cities</h2>
</header>
<section>
<nav>
<input type="button" value="캡쳐" />
<ul>
<li><a href="#">London</a></li>
<li><a href="#">Paris</a></li>
<li><a href="#">Tokyo</a></li>
</ul>
</nav>
<article>
<h1>London</h1>
<p>London is the capital city of England. It is the most populous city in the United Kingdom, with a metropolitan area of over 13 million inhabitants.</p>
<p>Standing on the River Thames, London has been a major settlement for two millennia, its history going back to its founding by the Romans, who named it Londinium.</p>
<input type="button" value="캡쳐" />
</article>
</section>
<footer>
<p>Footer</p>
</footer>
</body>
</html>
```



##### canvas -> image converter

* 콜백함수로 전달된 변수 `canvas` 에는 실제로 canvas 요소가 들어있습니다. 화면에 그려진 캔버스 요소는 이미지로 저장도 되지만 일반적인 `<img>` 태그가 더 익숙하실 것입니다. 그렇다면 canvas에서 제공하는 api를 이용하여 이미지 태그에 사용할 수 있는 Data URL 문자열로 변환하면 됩니다.


    canvas.toDataURL("image/jpeg")

* 위 함수를 호출하면 Data URL 문자열을 리턴합니다.(“image/jpeg” 외 다른 포맷도 가능)

##### add polyfill

* `html2canvas`는 `promise` 를 사용하기 때문에 프로미스를 지원하지 않는 인터넷 익스플로러에서는 사용할 수가 없습니다. 그러나 `promise`를 `polyfill` 처리를 한다면 IE9 이상에서 동작 가능하다고 나와있습니다. 한번 폴리필까지 적용해보겠습니다.

        ##### Browser compatibility

The library should work fine on the following browsers (with `promise`  polyfill )

* Firefox 3.5+
* Google Chrome
* Opera 12+
* IE9+
* Edge
* Safari 6+

다양한 폴리필 들이 있지만 (아마도) 가장 많이 사용되는 `es6-promise` 를 사용합니다.

링크에 Data URL을 넣고 다운로드 받는 방법은 크롬에선 이상 없지만 익스플로러에선 정상적으로 동작하지 않습니다. 따라서 다른 방법을 사용해야 합니다.

```
if (navigator.msSaveBlob) {
var blob = canvas.msToBlob();
return navigator.msSaveBlob(blob, 'fileName.jpg');
}
```



##### 정리 

이상으로 웹 화면을 캡쳐해서 이미지로 저장하는 방법을 알아 보았습니다. 우리가 흔히 사용하던 캡쳐 프로그램과 달리 특정 영역을 겹쳐서 캡쳐할수 있는것은 아니지만 외부 플러그인 사용없이 웹 화면에 보이는 그대로 이미지로 내려받을 수 있었습니다.

그러나 이것도 100% 동일한 이미지로 캡쳐되진 않습니다. 캡쳐 방법이 HTML의 DOM과 CSS 속성을 캔버스에 옮겨 이미지화 시키는 것인데 일부 CSS는 지원하지 않기 때문입니다. 



[참고] https://sub0709.tistory.com/48