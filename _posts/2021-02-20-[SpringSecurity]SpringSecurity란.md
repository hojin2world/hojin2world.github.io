---
layout: post
title:  "[Spring]SpringSecurity 란?"
categories: spring
comments: true



---

# SpringSecurity?

<br/>

----------

### 1. Spring Security란?

<br/>

대부분의 시스템에서는 회원의 관리를 하고 있고, 그에 따른 인증(Authentication)과 인가(Authorization)에 대한 처리를 해주어야 한다. Spring에서는 Spring Security라는 별도의 프레임워크에서 관련된 기능을 제공하고 있는데, 이번에는 Spring Security에 대해서 알아보도록 하겠다.

<br/>

Spring Security는 Spring 기반의 애플리케이션의 보안(인증과 권한, 인가 등)을 담당하는 스프링 하위 프레임워크이다. Spring Security는 '인증'과 '권한'에 대한 부분을 Filter 흐름에 따라 처리하고 있다. Filter는 Dispatcher Servlet으로 가기 전에 적용되므로 가장 먼저 URL 요청을 받지만, Interceptor는 Dispatcher와 Controller사이에 위치한다는 점에서 적용 시기의 차이가 있다. Spring Security는 보안과 관련해서 체계적으로 많은 옵션을 제공해주기 때문에 개발자 입장에서는 일일이 보안관련 로직을 작성하지 않아도 된다는 장점이 있다.

이러한 Spring Security의 아키텍쳐는 아래와 같다. 

![security1](https://user-images.githubusercontent.com/38201897/108676505-a9569780-752b-11eb-8164-0dd75c0b6f2e.png)

 

**위의 그림은 Form 기반 로그인에 대한 플로우를 보여주는 그림이다.**

1. 사용자가 Form을 통해 로그인 정보를 입력하고 인증 요청을 보낸다.
2. AuthenticationFilter(사용할 구현체 UsernamePasswordAuthenticationFilter)가 HttpServletRequest에서 사용자가 보낸 아이디와 패스워드를 인터셉트한다. 프론트 단에서 유효성검사를 할 수도 있지만, 무엇보다 안전! 안전을 위해서 다시 한번 사용자가 보낸 아이디와 패스워드의 유효성 검사를 해줄 수 있다.(아이디 혹은 패스워드가 null인 경우 등) HttpServletRequest에서 꺼내온 사용자 아이디와 패스워드를 진짜 인증을 담당할 AuthenticationManager 인터페이스(구현체 - ProviderManager)에게 인증용 객체(UsernamePasswordAuthenticationToken)로 만들어줘서 위임한다.
3. AuthenticationFilter에게 인증용 객체(UsernamePasswordAuthenticationToken)을 전달받는다.
4. 실제 인증을 할 AuthenticationProvider에게 Authentication객체(UsernamePasswordAuthenticationToken)을 다시 전달한다.
5. DB에서 사용자 인증 정보를 가져올 UserDetailsService 객체에게 사용자 아이디를 넘겨주고 DB에서 인증에 사용할 사용자 정보(사용자 아이디, 암호화된 패스워드, 권한 등)를 UserDetails(인증용 객체와 도메인 객체를 분리하지 않기 위해서 실제 사용되는 도메인 객체에 UserDetails를 상속하기도 한다.)라는 객체로 전달 받는다.
6. AuthenticationProvider는 UserDetails 객체를 전달 받은 이후 실제 사용자의 입력정보와 UserDetails 객체를 가지고 인증을 시도한다.
7. 8,9,10 인증이 완료되면 사용자 정보를 가진 Authentication 객체를 SecurityContextHolder에 담은 이후 AuthenticationSuccessHandle를 실행한다.(실패시 AuthenticationFailureHandler를 실행한다.)

여기까지 간단히 Form 로그인에 대한 플로우를 설명했다.

<br/>

### **[ 인증(Authorizatoin)과 인가(Authentication) ]**

- 인증(Authentication): 해당 사용자가 본인이 맞는지를 확인하는 절차
- 인가(Authorization): 인증된 사용자가 요청한 자원에 접근 가능한지를 결정하는 절차 



<img width="500" height="50" alt="security2" src="https://user-images.githubusercontent.com/38201897/108676509-aa87c480-752b-11eb-89e3-ac4ce11a85bd.png">



Spring Security는 기본적으로 인증 절차를 거친 후에 인가 절차를 진행하게 되며, 인가 과젱에서 해당 리소스에 대한 접근 권한이 있는지 확인을 하게 된다. Spring Security에서는 이러한 인증과 인가를 위해 Principal을 아이디로, Credential을 비밀번호로 사용하는 Credential 기반의 인증 방식을 사용한다. 

- Principal(접근 주체): 보호받는 Resource에 접근하는 대상
- Credential(비밀번호): Resource에 접근하는 대상의 비밀번호

---------------

#### **세션 기반 인증**

Spring Security의 인증 방식 중 전통적인 세션-쿠키 방식으로 인증을 진행한다.

* 클라이언트 측에서 서버에 로그인 요청
* 처음 Request 에는 세션 정보가 없기에 서버에서 session id 를 발급해준다.
* 다음부터 클라이언트는 요청의 header 정보에 session id 를 담아서 요청한다.
*  서버측에서는 이미 session id 를 알기에 추가 발급할 필요가 없다.
* 서버측에서는 header 에 담긴 session id 를 기반으로 사용자를 식별한다.

------

#### **토큰 기반 인증**

토큰 기반 인증은 `인증`을 토큰 기반으로 수행한다는 것입니다.

* 인증 받은 사용자들에게 토큰을 발급
* 서버에 요청 할 때 헤더에 토큰을 함께 보내도록 유효성 검사
* 서버나 세션에 유지하지 않고 클라이언트 측에서 들어오는 요청만으로 작업을 처리
* 상태를 유지하지 않으므로 Stateless 한 구조를 가진다.
* Stateless 한 구조를 가지니 서버 확장에 유리하다.
* 최근에는 JSON 포맷을 이용하는 JWT (JSON Web Token) 을 사용한다.

---------





<br/>

### 2. Spring Security 모듈

----------



### **[ Spring Security 주요 모듈 ]**

Spring Security의 주요 모듈은 아래와 같이 구성되며 각 항목들에 대해서 간단히 살펴보도록 하자.

![security3](https://user-images.githubusercontent.com/38201897/108676526-afe50f00-752b-11eb-8eaa-f5f8049a9ece.png)

<br/>

### **[ SecurityContextHolder ]**

SecurityContextHolder는 보안 주체의 세부 정보를 포함하여 응용프래그램의 현재 보안 컨텍스트에 대한 세부 정보가 저장된다. SecurityContextHolder는 기본적으로 SecurityContextHolder.MODE_INHERITABLETHREADLOCAL 방법과SecurityContextHolder.MODE_THREADLOCAL 방법을 제공한다.

 <br/>

### **[ SecurityContext ]**

Authentication을 보관하는 역할을 하며, SecurityContext를 통해 Authentication 객체를 꺼내올 수 있다.

 <br/>

### **[ Authentication ]**

Authentication는 현재 접근하는 주체의 정보와 권한을 담는 인터페이스이다. Authentication 객체는 Security Context에 저장되며, SecurityContextHolder를 통해 SecurityContext에 접근하고, SecurityContext를 통해 Authentication에 접근할 수 있다.

````java
public interface Authentication extends Principal, Serializable {
    // 현재 사용자의 권한 목록을 가져옴
    Collection<? extends GrantedAuthority> getAuthorities(); 
    // credentials(주로 비밀번호)을 가져옴
    Object getCredentials();
    Object getDetails();    
    // Principal 객체를 가져옴.
    Object getPrincipal();    
    // 인증 여부를 가져옴
    boolean isAuthenticated();    
    // 인증 여부를 설정함
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
````



<br/>

### **[ UsernamePasswordAuthenticationToken ]**

UsernamePasswordAuthenticationToken은 Authentication을 implements한 AbstractAuthenticationToken의 하위 클래스로, User의 ID가 Principal 역할을 하고, Password가 Credential의 역할을 한다. UsernamePasswordAuthenticationToken의 첫 번째 생성자는 인증 전의 객체를 생성하고, 두번째 생성자는 인증이 완려된 객체를 생성한다.

````java
public class UsernamePasswordAuthenticationToken extends AbstractAuthenticationToken {
    // 주로 사용자의 ID에 해당함
    private final Object principal;
    // 주로 사용자의 PW에 해당함
    private Object credentials;  
    // 인증 완료 전의 객체 생성
    public UsernamePasswordAuthenticationToken(Object principal, Object credentials) {
		super(null);
		this.principal = principal;
		this.credentials = credentials;
		setAuthenticated(false);
	}
    
    // 인증 완료 후의 객체 생성
    public UsernamePasswordAuthenticationToken(Object principal, Object credentials,
			Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.principal = principal;
		this.credentials = credentials;
		super.setAuthenticated(true); // must use super, as we override
	}
}

public abstract class AbstractAuthenticationToken implements Authentication, CredentialsContainer {
}
````



<br/>

### **[ AuthenticationProvider ]**

AuthenticationProvider에서는 실제 인증에 대한 부분을 처리하는데, 인증 전의 Authentication객체를 받아서 인증이 완료된 객체를 반환하는 역할을 한다. 아래와 같은 AuthenticationProvider 인터페이스를 구현해서 Custom한 AuthenticationProvider을 작성해서 AuthenticationManager에 등록하면 된다.

````java
public interface AuthenticationProvider {
	// 인증 전의 Authenticaion 객체를 받아서 인증된 Authentication 객체를 반환
    Authentication authenticate(Authentication var1) throws 	      	     	 AuthenticationException;
    boolean supports(Class<?> var1);
    
}
````



<br/>

### **[ Authentication Manager ]**

인증에 대한 부분은 SpringSecurity의 AuthenticatonManager를 통해서 처리하게 되는데, 실질적으로는 AuthenticationManager에 등록된 AuthenticationProvider에 의해 처리된다. 인증이 성공하면 2번째 생성자를 이용해 인증이 성공한(isAuthenticated=true) 객체를 생성하여 Security Context에 저장한다. 그리고 인증 상태를 유지하기 위해 세션에 보관하며, 인증이 실패한 경우에는 AuthenticationException를 발생시킨다.

````java
public interface AuthenticationManager {
	Authentication authenticate(Authentication authentication) 
		throws AuthenticationException;
}
````



AuthenticationManager를 implements한 ProviderManager는 실제 인증 과정에 대한 로직을 가지고 있는 AuthenticaionProvider를 List로 가지고 있으며, ProividerManager는 for문을 통해 모든 provider를 조회하면서 authenticate 처리를 한다.

````java
public class ProviderManager implements AuthenticationManager, MessageSourceAware,
InitializingBean {
    public List<AuthenticationProvider> getProviders() {
		return providers;
	}
    public Authentication authenticate(Authentication authentication)
			throws AuthenticationException {
		Class<? extends Authentication> toTest = authentication.getClass();
		AuthenticationException lastException = null;
		Authentication result = null;
		boolean debug = logger.isDebugEnabled();
        //for문으로 모든 provider를 순회하여 처리하고 result가 나올 때까지 반복한다.
		for (AuthenticationProvider provider : getProviders()) {
            ....
			try {
				result = provider.authenticate(authentication);

				if (result != null) {
					copyDetails(authentication, result);
					break;
				}
			}
			catch (AccountStatusException e) {
				prepareException(e, authentication);
				// SEC-546: Avoid polling additional providers if auth failure is due to
				// invalid account status
				throw e;
			}
            ....
		}
		throw lastException;
	}
}
````





위에서 설명한 ProviderManager에 우리가 직접 구현한 CustomAuthenticationProvider를 등록하는 방법은 WebSecurityConfigurerAdapter를 상속해 만든 SecurityConfig에서 할 수 있다. WebSecurityConfigurerAdapter의 상위 클래스에서는 AuthenticationManager를 가지고 있기 때문에 우리가 직접 만든 CustomAuthenticationProvider를 등록할 수 있다.





````java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
    @Bean
    public AuthenticationManager getAuthenticationManager() throws Exception {
        return super.authenticationManagerBean();
    }
      
    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() throws Exception {
        return new CustomAuthenticationProvider();
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(customAuthenticationProvider());
    }
}
````



<br/>

### **[ UserDetails ]**

인증에 성공하여 생성된 UserDetails 객체는 Authentication객체를 구현한 UsernamePasswordAuthenticationToken을 생성하기 위해 사용된다. UserDetails 인터페이스를 살펴보면 아래와 같이 정보를 반환하는 메소드를 가지고 있다. UserDetails 인터페이스의 경우 직접 개발한 UserVO 모델에 UserDetails를 implements하여 이를 처리하거나 UserDetailsVO에 UserDetails를 implements하여 처리할 수 있다.

````java
public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();
    String getPassword();
    String getUsername();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();   
}
````



<br/>

### **[ UserDetailsService ]**

UserDetailsService 인터페이스는 UserDetails 객체를 반환하는 단 하나의 메소드를 가지고 있는데, 일반적으로 이를 구현한 클래스의 내부에 UserRepository를 주입받아 DB와 연결하여 처리한다. UserDetails 인터페이스는 아래와 같다.

````java
public interface UserDetailsService {
 UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
````





<br/>

### **[ Password Encoding ]**

AuthenticationManagerBuilder.userDetailsService().passwordEncoder() 를 통해 패스워드 암호화에 사용될 PasswordEncoder 구현체를 지정할 수 있다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	// TODO Auto-generated method stub	auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
}

@Bean
public PasswordEncoder passwordEncoder(){
	return new BCryptPasswordEncoder();
}
````



<br/>

### **[ GrantedAuthority ]**

GrantAuthority는 현재 사용자(principal)가 가지고 있는 권한을 의미한다. ROLE_ADMIN나 ROLE_USER와 같이 ROLE_*의 형태로 사용하며, 보통 "roles" 이라고 한다. GrantedAuthority 객체는 UserDetailsService에 의해 불러올 수 있고, 특정 자원에 대한 권한이 있는지를 검사하여 접근 허용 여부를 결정한다.



<br/>

<br/>

[참고]

***스프링 시큐리티 한글번역**

* https://godekdls.github.io/Spring%20Security/contents/ 

***스프링 시큐리티 전체 구조**

* https://coding-start.tistory.com/153



* https://mangkyu.tistory.com/76
* https://mangkyu.tistory.com/77

- https://flyburi.com/584
- https://minwan1.github.io/2017/03/25/2017-03-25-spring-security-theory/
- https://tramyu.github.io/java/spring/spring-security/
- https://derekpark.tistory.com/42
- https://coding-start.tistory.com/153
- https://coding-start.tistory.com/search/JwtAuthorizationFilter
- https://daddyprogrammer.org/post/636/springboot2-springsecurity-authentication-authorization/
- http://progtrend.blogspot.com/2018/07/spring-boot-security.html

