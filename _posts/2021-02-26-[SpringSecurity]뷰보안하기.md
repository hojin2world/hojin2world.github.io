---
layout: post
title:  "[Spring]SpringSecurity  -  5 . 뷰 보안하기"
categories: spring
comments: true


---

# SpringSecurity - 5 . 뷰 보안하기

### 뷰 보안하기

<br/>

### 스프링 시큐리티 JSP 태그 라이브러리 사용하기

스프링 시큐리티의 JSP 태그 라이브러리로 뷰 레이어에서 보안을 지원한다.

| JSP 태그                     | 동작                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| <security:accesscontrollist> | 연결 제어 목록에서 권한이  부여된 사용자인 경우에만 조건부로 body의 내용을 렌더링함 |
| <security:authentication>    | 현재 인증 상세 정보를 렌더링함                               |
| <security:authorize>         | SpEL 표현식이  참으로 평가되거나                             |

 JSP 태그 라이브러리를 사용하기 위해, 사용될 모든 JSP 파일에 선언을 해준다.

````java
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %> 
````

<br/>

------

### 인증 상세 접근하기

<br/>

스프링 시큐리티 JSP 태그 라이브러리가 하는 가장 간단한 것 중 하나는 사용자의 인증 정보에 쉽게 접근하는 것이다.

security:authentication이 그런 동작을 위해 사용된다.

 <br/>

웹사이트에서는 일반적으로 사용자명으로 사용자를 확인하며 "welcome"이나 "hello"메시지를 표시

````java
Hello <security:authentication property="principal" />!  
````

property 애트리뷰트는 사용자 인증 객체의 프로퍼티를 확인한다.

<br/>

security:authentication JSP 태그를 사용하여 몇가지 사용자 인증 상세 정보에 접근

| 인증 프로퍼티 | 설정                                                         |
| ------------- | ------------------------------------------------------------ |
| authorities   | 사용자에게 부여된 권한을 표현하는 GrantedAuthority의 모음    |
| credentials   | 주체를 확인하기 위해 사용되는  자격(일반적으로 사용자의 암호) |
| details       | 인증과 관련한 추가 정보(IP 주소, 인증서 일련 번호,  세선 ID 등) |
| principal     | 사용자의 주체                                                |

security:authentication은 뷰에 있는 프로퍼티 값을 렌더링한다.

그리고 이 값을 변수에 할당하려면 간단히 var 애트리뷰트에 변수명을 명시한다.

 <br/>

loginID변수에 값을 할당해 주는 예

````java
 <security:authentication property="principal.username" var="loginID" /> 
````

변수는 기본 설정으로 페이지 범위로 생성된다.

하지만 요청이나 세션**(javax.servlet.jsp.PageContext)**같이 다른 범위로 생성하고 싶다면 **scope** 애트리뷰트로 명시해 줄 수 있다.

변수를 요청 범위로 생성하려면 **scope**를 **request**로 설정한다.

 ````java
<security:authentication property="principal.username" var="loginId" scope="request"/>
 ````

<br/>

---------------

### 조건부 렌더링

<br/>

사용자가 볼 수 있는 권한에 따라 뷰의 일부분이 보여지거나 감추어져야만 한다.

이미 로그인한 사용자에게 로그인 폼이 보이거나 로그인 하지 않은 사용자에게 개별적 환영 메시지를 보여 주는 것은 아무 의미가 없다.

스프링 시큐리티의 <security:authorize> JSP 태그는 사용자가 획득한 권한에 따라 뷰의 일부를 조건부로 렌더링한다.

 <br/>

**ROLE_SPITTER** 권한이 있을 때만 spittle 폼을 보여주기 위해 <security:authorize>를 사용한 예

SpEL 기반의 <security:authorize> 조건부 렌더링

````java
<security:authorize access="hasRole('ROLE_SPITTER')">
    ...
</security:authorize> 
````

**access** 애트리뷰트에는 <security:authorize> 보디의 렌더링 여부를 결정하기 위한 **SpEL** 표현식이 주어진다.

스프링 시큐리티에서 제공하는 표현식들을 포함하여 **access** 애트리뷰트를 설정할 때 사용했던 **SpEL**의 모든 기능을 갖고 있다.

애플리케이션에 사용자명이 **"habuma"**인 사용자만이 사용 가능한 관리 기능을 표시

````java
<security:authorize access="isAuthenticated() and principal.username=='habuma'">
    ...
</security:authorize>
````

**isAuthenticated()**는 사용자가 인증된 경우 참을 반환하는 메소드이다.

**principal**은 사용자 주체를 의미한다. 즉, **principal.username**은 사용자명을 뜻한다.



보안 설정에서 **antMatchers()** 메소드를 추가하면 /admin URL과 관련한 보안이 더 강화된다.

````java
authorizeRequests()
    .antMatchers("/admin")
        .access("isAuthenticated() and principal.username=='habuma'");
````

해당 URL(/admin)은 보안이 되어서 사용 권한이 있는 사용자가 아니라면 내용을 볼수가 없다.

이것을 위해 **SpEL 표현식**을 **보안 설정**과 **<security:authorize>** 태그의 **access 애트리뷰트** 두 곳에 선언했다.

<security:authorize> 태그의 url 애트리뷰트로 보안설정과 <security:authorize>의 access 애트리뷰트의 중복을 제거할 수 있다.

보안 제약이 명시적으로 선언된 **access 애트리뷰트**와 달리 **url 애트리뷰트**는 간접적인 방법으로 주어진 URL 패턴에 대한 보안 제약을 나타낸다. 

스프링 시큐리티 설정에서 이미 /admin에 대한 보안 제약을 선언했으므로 **url 애트리뷰트**를 아래처럼 사용할 수 있다.