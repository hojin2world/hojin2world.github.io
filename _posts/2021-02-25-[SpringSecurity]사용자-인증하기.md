---
layout: post
title:  "[Spring]SpringSecurity  -  4 . 사용자 인증하기"
categories: spring
comments: true

---

# SpringSecurity - 4 . 사용자 인증하기

<br/>

---------

### 사용자 인증하기

<br/>

**configure(HttpSecurity)**를 오버라이딩하기 전까지, 단순하지만 기능적으로 완전한 로그인 페이지를 사용할 수 있었다.

하지만 **configure(HttpSecurity)**를 오버라이딩함과 동시에 이 로그인 페이지를 사용할 수 없게 된다.

**configure(HttpSecurity)** 메소드에서 **formLogin()**을 호출해주면 로그인 페이지를 사용할 수 있게 된다.

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .formLogin()
        .and()
        .authorizeRequests()
 
        ...
}
````

**formLogin()** 을 호출해준 후 다른 설정 명령을 연결하기 위해 **and()**가 사용됬다.

<br/>

-----

### 사용자 정의 로그인 페이지 추가하기

<br/>

**로그인 JSP**

````java
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>
    <form name="f" action="/spitter/login" method="POST">
        <table>
            <tr>
                <td>User:</td>
                <td><input type="text" name="username" value=""/></td>
            </tr>
            <tr>
                <td>Password:</td>
                <td><input type="password" name="password"/></td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="submit" value="Login"/>
                </td>
            </tr>
            <input name="_csrf" type="hidden" value="6829b1ae-0a14-4920-aac4-5abbd7eeb9ee"/>
        </table>
    </form>
</body>
</html>
````

CSRF를 활성화하였다면, CSRF 토큰으로 된 **_csrf** 필드가 있다는 것을 확인해야 한다.

<br/>

----

### HTTP 기본 인증 활성화 하기

<br>

**HTTP 기본 인증**은 사용자를 직접 애플리케이션에 **HTTP 요청 자체로 인증**한다.

웹 브라우저를 통해 이러한 인증을 하면, 사용자는 입력을 요청받는다.

이러한 것은 **HTTP 401** 응답으로 사용자명과 암호가 반드시 요청과 함께 제공되어야 한다.

이러한 것들은 사용자가 사용하려는 서비스에 인증하기 위한 **REST 클라이언트** 수단으로 적합하다.

<br/>

**HTTP 기본 인증 활성화 방법**은 **configure()** 메소드로 전달되는 **HttpSecurity** 객체의 **httpBasic()** 메소드 호출이다.

원하는 대로 범위를 명시하기 위해서 **realmName()**을 호출하는 것도 가능하다.

 <br/>

**HTTP 기본을 활성화하기 위한 스프링 시큐리티 설정**

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .formLogin()
            .loginPage("/login")
        .and()
        .httpBasic()
            .realmName("spitter")
    ...                    
}
````

<br/>

------

### 기억하기 기능 활성화

<br/>

스프링은 사용자가 한 번 로그인하면 재방문 시에는 애플리케이션 사용자를 기억할 수 있도록 **기억하기(remember-me)** 기능을 제공한다.

기억하기 지원을 활성화하기 위해 **configure()**에 전달되는 **HttpSecurity** 객체에서 **rememberMe()**를 호출해주면 된다. 

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .formLogin()
            .loginPage("/login")
        .and()
        .rememberMe()
            .tokenValiditySeconds(2419200)
            .key("spitterKey")
    ...    
}
````

**tokenValiditySeconds()** 메소드는 기본적으로**최대 2주까지 유효한 쿠키(cookie)**에 저장된다.

하지만 위의 코드에서는 토큰이 최대 4주(2,419,200)까지 유효하도록 명시하였다.

쿠키에 저장되는 토큰은 사용자명, 암호, 만료일, 개인 키로 구성되어 있다.

모든 내용은 쿠키에 쓰여지기 전에 **MD5 해시(hash)**로 부호화된다.

기본적으로 개인 키는 **SpringSecured**이지만, 위의 코드에서는 **spitterKet**로 설정하였다.