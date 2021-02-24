---
layout: post
title:  "[Spring]SpringSecurity  -  3 . 요청 가로채기"
categories: spring
comments: true




---

# SpringSecurity - 3 . 요청 가로채기

<br/>

----------

### 요청 가로채기

<br/>

각 요청에 대해서 보안 수준을 잘 조절하기 위한 **키**는 **WebSecurityConfigurerAdapter**의 **configure(HttpSecurity)** 메소드 오버라이딩 이다. 

 

다른 URL 패스들에 대해 선택적으로 보안을 적용하기 위한 **configure(HttpSecurity)**의 오버라이딩

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/spiters/me").authenticated()
            .antMatchers(HttpMethod.POST,".spittles").authenticated()
            .anyRequest().permitAll();
}
````

**configure()** 메소드로 전달되는 **HttpSecurity** 객체는 몇 가지 **HTTP 보안**의 관점을 설정하기 위해 사용된다.

여기서는 우선 **authorizeRequest()**를 호출하고, 다음에 반환되는 객체로 호출되는 메소드들은 요청 보안 수준의 세부적인 설정을 나타낸다.

첫 번째로 호출되는 **antMatchers()**는 패스가 **/spitters/me**인 요청은 인증되어야 함을 명시한다.

두 번째 **antMatchers()**는 더 상세하게 모든 **/spittles에 대한 HTTP POST** 요청이 인증되어야 함을 말해 준다.

마지막으로 **anyRequests()**의 호출은 다른 모든 요청들을 인증이나 권한 없이 허용한다.

<br/>

**antMatcher()**에 주어지는 패스들은 **Ant** **스타일** **와일드카드를** 사용할 수 있다.

아래처럼 패스를 명시해 주는 것도 가능하다.

````java
.antMatchers("/spitters/**").authenticated();
````

**antMatcher()**의 단일 호출에서 아래처럼 여러 패스를 명시하는 것도 가능하다.

````java
.antMatchers("/spitters/**","/spittles/mine").authenticated();
````

**antMatcher()** 메소드가 Ant 스타일 와일드카드를 포함한 패스로 동작하는 반면, 요청 패스에 정규 표현식을 사용할 수 있는 **regexMatchers()** 메소드도 있다.

아래는**/spitters(Ant)** 스타일에 상응하는 정규 표현식을 사용한다.

````java
.regexMatchers("/spitters/.*").authenticated();
````

패스 선택 외에도 **authenticated()**와 **permitAll()**도 보안이 필요한 패스를 정의하기 위해 사용된다.

**authenticated()** 메소드는 애플리케이션에 로그인된 사용자가 요청을 수행할 떄 필요하다. 만약 사용자가 인증되지 않았다면, 스프링 시큐리티 필터는 요청을 잡아내고 사용자를 로그인 페이지로 리다이렉션 해준다.

**permitAll()** 메소드는 어떠한 보안 요구 없이 요청을 허용해준다.

<br/>

**패스에** **보안을** **적용하기** **위한** **메소드**

| 메소드                         | 동작                                                      |
| ------------------------------ | --------------------------------------------------------- |
| **access(String)**             | 주어진 SpEL 표현식의 평가 결과가 true이면 접근을 허용     |
| **anonymous()**                | 익명의 사용자의 접근을 허용                               |
| **authenticated()**            | 인증된 사용자의 접근을 허용                               |
| **denyAll()**                  | 무조건 접근을 허용하지 않음                               |
| **fullyAuthenticated()**       | 사용자가 완전히 인증되면 접근을  허용(기억되지 않음)      |
| **hasAnyAuthority(String...)** | 사용자가 주어진 권한 중 어떤  것이라도 있다면 접근을 허용 |
| **hasAnyRole(String...)**      | 사용자가 주어진 역할 중 어떤  것이라도 있다면 접근을 허용 |
| **hasAuthority(String)**       | 사용자가 주어진 권한이 있다면  접근을 허용                |
| **hasIpAddress(String)**       | 주어진 IP로부터 요청이 왔다면 접근을 허용                 |
| **hasRole(String)**            | 사용자가 주어진 역할이 있다면  접근을 허용                |
| **not()**                      | 다른 접근 방식의 효과를 무효화                            |
| **permitAll()**                | 무조건 접근을 허용                                        |
| **rememberMe()**               | 기억하기를 통해 인증된 사용자의  접근을 허용              |

위의 표에 나와 있는 메소드를 사용하면 인증된 사용자 이상으로 요구되는 보안 설정을 할 수 있다.

<br/>

**ROLE_SPITTER** 권한이 있는 사용자를 요구 

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/spiiters/me").hasAuthority("ROLE_SPITTER")
            .antMatchers(HttpMethod.POST,".spittles").hasAuthority("ROLE_SPITTER")
            .anyRequest().permitAll();
}
````

**ROLE_** 접두사를 자동 적용시켜주기 위한 **hasRole()** 메소드를 사용

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/spiiters/me").hasRole("SPITTER")
            .antMatchers(HttpMethod.POST,".spittles").hasRole("SPITTER")
            .anyRequest().permitAll();
}
````

애플리케이션 전체에 대한 보안 설정이 필요하다면, **antMatchers()**, **regexMatchers()**, **anyRequest()**를 원하는 만큼 연결해서 사용할 수 있다. 하지만, 주어진 순서에 따라 적용이 되는 것을 알고 있어야 한다. 그러므로 가장 세분화된 요청 패스 패턴을 먼저 적용하고 **anyRequest()**같이 세부적이지 않은 것은 나중에 적용해야한다. 그렇지 않다면 상대적으로 세부적인 내용들이 적용되지 않는다.

------

### 스프링 표현식 보안

<br/>

위의 **패스** **보안을** **적용하기** **위한** **설정** **메소드** **표**에 정의된 메소드가 아니고서는 어떠한 조건을 적용시킬 수가 없다.

또한 동일한 패스에 동시에 메소드를 적용할 수 없다.

하지만 **access()** 메소드를 사용하면 접근 요구 사항을 선언하기 위한 수단으로 **SpEL**을 사용할 수 있다. 

 

**/spitter/me** URL 패턴 접근에 **ROLE_SPITTER** 역할이 요구되도록 하는 예.

````java
 .antMatchers("/spitter/me").access("hasRole('ROLE_SPITTER')")
````

여기서 **/spitter/me**에 적용된 보안 제약은 위의 예인 **ROLE_SPITTER** 권한이 있는 사용자를 요구하는 제약과 동등하다.

**SpEL**을 보안 규칙을 표현하는 데 사용하였다. **hasRole()** 표현은 현재 사용자가 주어진 권한을 획득했다면 true로 평가된다.

**hasRole()**는 스프링 시큐리티에서 지원되는 보안 특성 표현이다.

<br/>

**스프링** **시큐리티에서** **사용** **가능한** **SpEL**

| 보안 표현                  | 평가 내용                                                    |
| -------------------------- | ------------------------------------------------------------ |
| **authentication**         | 사용자의 인증 객체                                           |
| **denyAll**                | 항상 거짓으로 평가함                                         |
| **hasAnyRole(역할  목록)** | 사용자가 역할 목록 중 하나라도  역할이 있는 경우 참          |
| **hasRole(역할)**          | 사용자가 주어진 역할이 있는  경우 참                         |
| **hasIpAddress(IP 주소)**  | 주어진 IP 주소로부터 요청이 오는 경우 참                     |
| **isAnonymous()**          | 사용자가 익명인 경우 참                                      |
| **isAuthenticated()**      | 사용자가 인증된 경우 참                                      |
| **isFullyAuthenticated()** | 사용자가 완전히 인증된 경우  참 (기억하기(remember-me)로는 인증되지 않음) |
| **isRememberMe()**         | 사용자가 기억하기(remember-me)로 인증된 경우 참              |
| **permitAll**              | 항상 참으로 평가함                                           |
| **principal**              | 사용자의 주체 객체                                           |

스프링 시큐리티의 SpEL 표현식을 사용하면, 사용자의 권한에 기반을 둔 접속 제한 이외에 더 많은 것이 가능하다.

 <br/>

**/spitter/me** URL을 **ROLE_SPITTER**가 요구되도록 잠글 뿐만 아니라 주어진 IP를 통해서만 접근이 가능하게 하려면 아래처럼 **access()** 메소드를 호출한다.

````java
.antMatchers("/spitter/me").access("hasRole('ROLE_SPITTER') and hasIpAddress('192.168.1.2')")
````

SpEL 기반의 보안 제약의 사용으로 가능성은 무한대다.



-----

### 채널 보안 적용하기

<br/>

HTTP를 통해 데이터를 제출하는 것은 위험한 일이 될 수 있다.

중요한 정보들은 반드시 암호화되어서 HTTP를 통해 전달되어야 한다.

**HTTPS**로 작업하는 것은 매우 쉬워서 URL에서 http 뒤에 s를 붙이고 설정만 해주면 된다.

**authorizeRequests()** 메소드뿐 아니라 **configure()** 메소드에 넘겨지는 **HttpSecurity** 객체는 다양한 URL 패턴에 대한 채널 요구 사항을 선언하는 **requiresChannel()** 메소드가 있다.

<br/>

**requiresChannel()** 메소드는 선택한 URL에 HTTPS를 적용

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/spiiters/me").hasRole("SPITTER")
            .antMatchers(HttpMethod.POST,".spittles").hasRole("SPITTER")
            .anyRequest().permitAll()
        .and()
        .requiresChannel()
            .antMatchers("/spitter/form").requiresSecure();
}
````

**/spitter/form** 요청이 들어올 떄, 스프링 시큐리티는 요청에서**(매번 requiresSecure()가 호출될 때)** 안전한 채널이 요구하는지 확인하고 자동적으로 요청을**HTTPS**로 리다이렉션 시켜준다.

<br/>

반대로 몇몇 페이지들은 HTTPS를 통해 보낼 필요가 없다.

이런 경우 requiresSecure() 대신 **requiresInsecure()**를 사용하여 항상 HTTP를 통해 전송하도록 선언해 줄 수 있다.

````java
.antMatchers("/").requiresInsecure();
````

**HTTPS**를 통해 **/**에 요청이 들어오면 스프링 시큐리티는 요청을 보안이 적용되지 않는 HTTP로 리다이렉션시켜 준다.

채널에 대한 보안 시행에 패스를 선택하는 방법이 **authorizeRequests()**를 사용하는 것에 주목하자.

-------

### 사이트 간 요청 위조 방지하기

<br/>

**사이트 간 요청 위조(CSRF, Cross-Site Request Forgery)** 공격은 특정 사이트에서 사용자에게 다른 서버에 좋지 않은 결과를 야기시키는 요청을 제출하도록 속인다.

**스프링 시큐리티 3.2 부터** **CSRF** 보안은 기본 설정으로 활성화되어 있다. **CSRF** 보호를 위한 조취를 취하지 않거나 이 기능을 비활성화한다면 애플리케이션에 제출되는 폼을 성공적으로 얻어 오는데 문제가 발생한다.

 <br/>

스프링 시큐리티는 동기화 장치 토큰으로 **CSRF** 보호에 대한 내용을 구현한다.

상태 변경 요청**(GET,HEAD,OPTION,TRACE가 아닌 모든 요청)**들을 가로채여서 **CSRF** 토큰을 확인받게 된다.

요청에 **CSRF** 토큰이 없거나 서버의 토큰과 일치하지 않는다면 요청은 **CsrfException**과 함께 실패하게 된다.

 <br/>

이는 애플리케이션의 모든 폼은 반드시 **_csrf** **필드**를 제출해야 한다는 의미다.

그리고 그 토큰은 서버에서 계산되고 저장되는 토큰과 같아야 한다. 그렇게 되면 폼이 제출될 때 토큰을 맞춰보게 된다.

 <br/>

스프링 시큐리티는 요청 애트리뷰트 속 요청에 토큰을 넣어 주는 방법을 쉽게 제공해주고 있다.

**JSP**를 페이지 템플릿으로 사용할경우

````java
<input type="hidden" name="${_csrf.paremeterName }" value="${_csrf.token }"/>
````

여기에 더해, **스프링** **폼** **바인딩** **태그** **라이브러리**를 사용한다면 <sf:form> 태그는 자동으로 숨겨진 CSRF 토큰 태그를 붙여준다.

 <br/>

**CSRF**를 처리하는 또 다른 방법은 아예 사용하지 않는 것이다.

**csrf().disable()**을 호출해서 스프링 시큐리티의 **CSRF** 보호 기능을 비활성화할 수 있다.

````java
@Override
protected void configure(HttpSecurity http) throws Exception {
      http
        ...
        .csrf().disable();
}
````

비활성화 한다는 것은 애플리케이션을 **CSRF** 공격에 그냥 방치하는 것과 같기 때문에 좋은 방법이 아니다.