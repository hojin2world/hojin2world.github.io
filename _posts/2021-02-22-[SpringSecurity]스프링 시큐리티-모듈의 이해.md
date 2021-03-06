---
layout: post
title:  "[Spring]SpringSecurity  -  1 . 스프링 시큐리티 모듈의 이해"
categories: spring
comments: true


---

# SpringSecurity  -  1 . 스프링 시큐리티 모듈의 이해

<br/>

----------------------

### 스프링 시큐리티 모듈의 이해

<br/>

스프링 시큐리티를 사용할 때, 애플리케이션의 종류와 관계없이 먼저 할 일이 
**스프링 시큐리티 모듈 추가**다.

<br/>

##### 스프링 시큐리티 모듈 

| 모듈              | 설명                                                         |
| ----------------- | ------------------------------------------------------------ |
| ACL               | 접근 제어 목록(ACL, Access Control List)을 통한 도메인 객체 보안을 지원한다. |
| Aspects           | 스프링 시큐리티 애너테이션을  사용할 때, 표준 스프링 AOP 대신 AspectJ 기반의 관점을 지원하기 위한 작은 모듈 |
| CAS Client        | Jasig의 통합  인증 서비스(CAS, Central Authentication Service)를 사용하여 통합 인증  로그인(SSO, Single Sign-On)을 지원한다. |
| **Configuration** | XML과 자바를  통한 스프링 시큐리티 설정을 지원한다. (자바 설정은 스프링 시큐리티 3.2에서 지원) |
| **Core**          | 스프링 시큐리티 라이브러리의  핵심 기능을 제공한다.          |
| Cryptography      | 암호화 및 암호 부호화를 지원한다.                            |
| LDAP              | LDAP 기반  인증을 지원한다.                                  |
| OpenID            | OpenID로 중앙  집중 인증을 지원한다.                         |
| Remoting          | 스프링 리모팅 통합을 지원한다.                               |
| **Tag  Library**  | 스프링 시큐리티의 JSP 태그 라이브러리를 지원한다.            |
| **Web**           | 스프링 시큐리티의 필터 기반  웹 보안을 지원한다.             |

최소한 Core와 Configuration 모듈은 애플리케이션의 클래스패스에 포함한다.

스프링 시큐리티는 웹 애플리케이션 보안을 위해 자주 사용되는 Web 모듈도 추가해야한다.

또한 스프링 시큐리티의 JSP 태그 라이브러리의 장점을 활용하기 위해서 Tag Library도 추가한다.

<br/>

<br/>

#### 웹 요청 필터

<br/>

스프링 시큐리티는 다양한 보안의 관점들을 제공하기 위해 몇 가지 서블릿 필터를 제공한다.

스프링은 **DelegatingFilterProxy** 필터 하나만 설정함으로서 해결할수 있다.

자바로 DelegatingFilterProxy를 설정하려면, **AbstractSecurityWebApplicationInitializer**를 상속받아 새로운 클래스를 만들어주면 된다.

````java
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;
 
public class SecurityWebInitializer 
    extends AbstractSecurityWebApplicationInitializer{
}
````

**AbstractSecurityWebApplicationInitializer**는 WebApplicationInitializer의 구현이므로 스프링에 의해 찾아지고 웹 컨테이너와 DelegatingFilterProxy를 등록하는데 사용된다.

DelegatingFilterProxy 설정 방식은, 애플리케이션으로 들어오는 요청을 가로채 ID가 springSecurityFilterChain인 빈에게 위임시칸다.

<br/><br/>

#### 보안설정

<br/>

스프링 MVC 웹 보안을 활성화하는 가장 간단한 클래스 설정

````java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
 
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
}
````

**@EnableWebSecurity** 애너테이션은 웹 보안을 활성화 한다. 하지만 그자체로는 유용하지 않고, 스프링 시큐리티가 **WebSecurityConfigurer**를 구현하거나 컨텍스트의 **WebSebSecurityConfigurerAdapter**를 확장한 빈으로 설정되어 있어야 한다.

하지만 **WebSebSecurityConfigurerAdapter**를 확장하여 클래스를 설정하는 것이 가장 편하고 자주 쓰이는 방법이다.

<br/>

스프링 MVC에서 웹 보안을 활성화하기 위한 클래스 설정

````java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
 
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
}
````

**@EnableWebMvcSecurity** 애너테이션은 스프링 MVC 인수 결정자를 설정하여, 핸들러 메소드가 @AuthenticationPrincipal 애너테이션이 붙은 인자를 사용하여 인증한 사용자 주체를 받는다.

또한 자동으로 숨겨진 사이트 간 요청 위조(CSRF, Cross-Site Request Forgery) 토큰필드(token field)를 스프링의 폼 바인딩 태그 라이브러리를 사용하여 추가하는 빈을 설정한다.

<br/>

**WebSebSecurityConfigurerAdapt**는 세가지 configure() 메소드를 오버라이딩하고 동작을 설정하는 것으로 웹 보안을 설정할 수 있다.

| 메소드                                  | 설명                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| configure(WebSecurity)                  | 스프링 시큐리티의 필터 연결을  설정하기 위한 오버라이딩이다. |
| configure(HttpSecurity)                 | 인터셉터로 요청을 안전하게  보호하는 방법을 설정하기 위한 오버라이딩이다. |
| configure(AuthenticationManagerBuilder) | 사용자 세부 서비스를 설정하기  위한 오버라이딩이다.          |

````java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
 
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
 
    @Override
    protected void configure(HttpSecurity http) throws Exception {
         http.authorizeRequests()
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .and()
            .httpBasic();
    }
}
````

애플리케이션으로 들어오는 모든 HTTP 요청이 인증되기 위해서 authorizeRequests()와 anyRequest().authenticated()가 호출된다.

이는 또한 스프링 시큐리티가 HTTP 기본 설정뿐 아니라 폼 기반 로그인(미리 정의된 로그인 페이지를 사용)을 통한 인증을 지원하도록 설정한다.

한편 **configure(AuthenticationManagerBuilder)** 메소드를 오버라이딩하지 않았으므로 인증 절차를 지원하기 위한 사용자 저장소가 없다.

그러므로 모든 요청은 인증을 요구하지만, 아무도 로그인 할수 없다.

 <br/>

애플리케이션에서 요구하는 것을 맞춰 주기 위한 설정이 있다.

* 사용자 저장소 설정

* 인증이 필요한 요청과 아닌 요청을 명시하고, 필요한 권한이 무엇인지 명시

* 평범한 기본 로그인 화면을 대체하기 위한 수정된 로그인 화면 제공

<br/>