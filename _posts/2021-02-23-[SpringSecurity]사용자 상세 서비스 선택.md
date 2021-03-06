---
layout: post
title:  "[Spring]SpringSecurity  -  2 . 사용자 상세 서비스 선택"
categories: spring
comments: true



---

# SpringSecurity - 2 . 사용자 상세 서비스 선택

<br/>

---------------

### **사용자** **상세** **서비스** 선택

<br/>

스프링 시큐리티는 지극히 유연하여 어떠한 데이터 저장소에 대해서도 가상으로 사용자 인증이 가능하다.

몇 가지 일반적인 사용자 저장 방식인 인메모리, 관계형 데이터베이스, LDAP에 기능을 제공하고, 사용자 저장에 대한 구현을 새롭게 만들어 사용할 수도 있다.

------

**인메모리** **사용자** **저장소로** **작업하기**

<br/>

**WebSecurityConfigurerAdapter**를 확장하여 보안 설정을 했으므로 가장 쉽게 사용자 저장소를 설정하는 방법은 **AuthenticationManagerBuilder**를 인자로 갖는 configure() 메소드를 오버라이딩하는 것이다.

**AuthenticationManagerBuilder**는 스프링 시큐리티의 인증에 대한 지원을 설정하는 몇 가지 메소드를 가지고 있다.

**inMemoryAuthentication()** 메소드로 활성화 및 설정이 가능하고 선택적으로 인메모리 사용자 저장소에 값을 채울 수 있다.

````java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication
                                                        .builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web
                                                    .configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web
                                                    .servlet.configuration.EnableWebMvcSecurity;
 
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
 
    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user").password("password").roles("USER").and()
                .withUser("admin").password("password").roles("USER","ADMIN");
    }
}
````

**AuthenticationManagerBuilder**는 인증 설정을 만들기 위한 빌더 스타일 인터페이스를 사용하는 configure()에 인자로 사용된다.

간단히 **inMemoryAuthentication()**를 호출하는 것으로 인메모리 사용자 저장소가 활성화된다.

**withUser()**는 **UserDetailsManagerConfigurer.UserDetailBuilder**를 반환하고, 이는 사용자 암호를 설정하는 **password()**와 사용자에게 권한에 대한 역할을 부여해 주는 **roles()**를 포함한 몇 가지 사용자 설정 메소드를 제공한다.

<br/>

**password(), roles(), and()** 뿐만 아니라 인메모리 사용자 저장소에서 사용자  상세 정보를 설정하기 위한 메소드가 몇가지 더있다.

**UserDetailsManagerConfigurer.UserDetailBuilder**에 사용가능한 모든 메소드가 정리되어 있다.

<br/>

**사용자 상세 정보를 설정하는 메소드**

| 메소드                                                       | 설명                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| **accountExpired(boolean)**                                  | 계정이 만료되었는지 아닌지를  정의     |
| **accountLocked(boolean)**                                   | 계정이 잠겨 있는지 아닌지를  정의      |
| **and()**                                                    | 설정을 연결하기 위해 사용              |
| **authorities(GrantedAuthority...)**                         | 사용자에게 부여된 권한들을  명시       |
| **authorities(List<? extends                GrantedAuthority>)** | 사용자에게 부여된 권한들을  명시       |
| **authorities(String...)**                                   | 사용자에게 부여된 권한들을  명시       |
| **credentialsExpired(boolean)**                              | 자격이 만료되었는지 아닌지를  정의     |
| **disabled(boolean)**                                        | 계정이 비활성화되었는지 아닌지를  정의 |
| **password(String)**                                         | 사용자의 암호를 명시                   |
| **roles(String...)**                                         | 사용자에게 부여된 역할을 명시          |

authorities() 메소드의 축약으로 roles() 메소드가 사용된다.

roles()의 인자로 사용된 값들에 ROLE_ 접두사를 붙여서 사용자에게 권한으로 부여해 줄 수 있다.

````java
auth
.inMemoryAuthentication()
.withUser("user").password("password").authorities("ROLE_USER").and()     .withUser("admin").password("password").authorities("ROLE_USER","ROLE_ADMIN");
````

인메모리 사용자 저장소가 디버깅이나 개발 테스트 목적으로만 유용하다.

---------

**데이터베이스** **테이블로** **인증하기**

<br/>

스프링 시큐리티에서 JDBC 지원 사용자 저장소에서 인증하기 위해 **jdbcAuthentication()** 메소드를 사용한다.

````java
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
 
    @Autowired
    DataSource dataSource;
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth
            .jdbcAuthentication()
                .dataSource(dataSource);
    }
}
````

DataSource만 설정해 주면 관계형 데이터에 접근이 가능해진다.

-----------

**기본** **사용자** **쿼리** **오버라이딩**

<br/>

최소한의 설정으로도 동작을 하지만, 데이터베이스 스키마에 대한 가정을 필요로 한다.

사용자 데이터를 저장하기 위한 특정 테이블이 있다는 것을 예상한다.

스프링 시큐리티 내부의 코드들이 사용자 상세 정보를 검색하기 위해 SQL 쿼리를 실행한다.

하지만 데이터베이스에 테이블이 잘 정의 되어 있지 않다면 쿼리에 대한 추가적으로 제어를 해야한다.

자체적인 쿼리를 설정한다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .jdbcAuthentication()
            .dataSource(dataSource)
            .usersByUsernameQuery("select username, password, true "+
                                  "from Spitter where username=?")
            .authoritiesByUsernameQuery("select username, 'ROLE_USER' from Spitter where username=?");
}
````

기본 SQL 쿼리들을 자체적으로 디자인한 쿼리로 대체할 때, 쿼리들의 기본 조건들을 충실히 지켜주는 것이 매우 중요하다.

모든 쿼리들은 사용자명을 유일한 인자로 사용한다.

인증 쿼리에서는 사용자명,암호, 활성화 여부를 선택한다.

권한 쿼리는 사용자명과 사용자명과 부여받은 권한으로 되어 있는 열을 선택한다.

------------

**부호화된** **암호로** **작업하기**

<br/>

사용자 암호가 데이터베이스에 저장될때 암호를 부호화 하지 않으면 문제가 될 수 있다.

이런 문제를 해결하기 위해 passwordEncoder() 메소드를 호출하여 암호에 적용할 보호화기(encoder)를 명시할 수 있다.

````java
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    DataSource dataSource;
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth
            .jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery("select username, password, true "+
                                      "from Spitter where username=?")
                .authoritiesByUsernameQuery("select username, 'ROLE_USER'"+
                                      "from Spitter where username=?")
                .passwordEncoder(new StandardPasswordEncoder("53cr3t"));
    }
}
````

passwordEncoder() 메소드는 스프링 시큐리티의 PassEncoder 인터페이스에 대한 어떠한 구현도 받을 수 있다.

스프링 시큐리티의 암호화 모듈은 다음 세 가지의 구현들을 포함한다.

<br/>

* **BCryptPasswordEncoder**
* **NoOpPasswordEncoder**
* **StandardPasswordEncoder**

<br/>

제공되고 있는 구현들 외에도 사용자 요구를 만족하지 못한다면 자체적인 구현을 사용할 수 있다.

**PasswordEncoder** **인터페이스**

````java
package org.springframework.security.crypto.password;
 
public interface PasswordEncoder {
    String encode(CharSequence rawPassword);
    boolean matches(CharSequence rawPassword, String encodedPassword);
}
````

사용될 부호화기의 종류는 중요하지 않다.

데이터베이스에 저장된 암호들이 절대 복호화되지 않는다.

대신 사용자가 로그인 시 입력한 암호는 동일한 알고리즘에 의해 부호화되고 데이터베이스에 있는 부호화되어 있는 암호와 비교하게 된다.

PasswordEncoder의 **matches()** **메소드**가 이러한 비교를 수행한다.

관계형 데이터베이스는 사용자 데이터를 저장하기 위한 한 가지 방법에 지나지 않는다.

사용자 데이터를 저장하는 매우 일반적인 방식은 LDAP 저장소를 사용하는 방식이다.

-------------

**LDAP** **기반** **인증** **적용하기**

<br/>

스프링 시큐리티에 LDAP 기반 인증을 설정하기 위해서는 ldapAuthentication() 메소드를 사용해야 한다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchFilter("(uid={0})")
            .groupSearchFilter("member={0}");
}
````

**userSearchFilter()**와 **groupSearchFilter()**는 사용자와 그룹을 찾기 위한 기본 LDAP 쿼리 필터를 제공하기 위해 사용된다.

기본 설정으로 사용자와 그룹에 대한 기본 쿼리는 비어 있는데, 이는 LDAP 계층의 루트(root)부터 검색이 완료되었음을 의미한다.

하지만 기본 쿼리를 명시해 주는 것으로 변경해 주는 것이 가능하다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchBase("ou=people")
            .userSearchFilter("(uid={0})")
            .groupSearchBase("ou=groups")
            .groupSearchFilter("member={0}");
}
````

**userSearchBase()**는 사용자를 찾기 위한 기본 쿼리를 제공한다.

**groupSearchBase()**는 그룹을 찾는 쿼리를 명시한다. 

위의 예제는 루트부터 검색하는 것보다는 검색될 사용자를 조직 구성단위가 people인 것으로 한정한것. 

그리고 그룹 조직은 구성단위가 groups인 곳에서 찾도록 되어 있다.

-----

**암호** **비교설정**

<br/>

LDAP으로 인증하는 기본 전략은 사용자를 직접 LDAP 서버에서 인증하는 바인딩 명령을 실행하는 것이다. 

다른 선택은 비교 명령을 실행하는 것이다.

이것은 입력받은 암호를 LDAP 디렉터리로 보내어 서버에서 사용자의 암호 애트리뷰트와 비교할 것을 요청하는 것과 관련있다.

비교 자체가 LDAP 서버 내에서 끝나므로 실제 암호는 여전히 감추어질 수 있다.

<br/>

암호로 비교 인증을 하고 싶다면 **passwordCompare()** 메소드를 선언한다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchBase("ou=people")
            .userSearchFilter("(uid={0})")
            .groupSearchBase("ou=groups")
            .groupSearchFilter("member={0}")
            .passwordCompare();
}
````

로그인 폼에서 기본 설정으로 전달된 암호는 사용자의 LDAP 엔트리의 userPassword 애트리뷰트의 값과 비교한다.

암호가 다른 애트리뷰트에 저장되어 있다면 암호 애트리뷰트 명을 **passwordAttribute()**를 사용하여 명시한다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchBase("ou=people")
            .userSearchFilter("(uid={0})")
            .groupSearchBase("ou=groups")
            .groupSearchFilter("member={0}")
            .passwordCompare()
            .passwordEncoder(new Md5PasswordEncoder())
            .passwordAttribute("password");
}
````

"password" 애트리뷰트가 전달된 암호와 비교되도록 명시되어 있다.

게다가 암호의 부호화기도 명시되어 있다.

이것은 서버 쪽의 암호 비교가 수행될 때 실제 암호를 감추기에 좋은 방법이다.

하지만 입력되는 암호는 여전히 LDAP 서버 쪽으로 연결되어 전달되고 이것은 해커가 가로챌 수 있다.

이것을 방지하기 위해 **passwordEncoder()** 메소드를 호출하여 암호화 전략을 명시할 수 있다.

----------

**원격** **LDAP** **서버에서** **조회하기**

<br/>

기본 설정은 스프링 시큐리티의 LDAP 인증에서는 LDAP 서버가 로컬호스트(localhost)의 33389포트를 열고 있을 것을 가정한다.

하지만 LDAP 서버가 다른 곳에 있다면 contextSource().url("경로") 메소드를 사용해서 위치를 설정해 주어야 한다.

------------

**내장된** **LDAP** **서버** **설정하기**

<br/>

인증을 처리해 주기 위한 LDAP 서버를 갖고 있지 않다면, 스프링 시큐리티는 내장 LDAP 서버를 제공해 준다.

원격 LDAPA 서버의 URL을 설정하는 대신 root() 메소드를 사용하여 내장 서버의 루트 접두사를 명시할 수 있다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchBase("ou=people")
            .userSearchFilter("(uid={0})")
            .groupSearchBase("ou=groups")
            .groupSearchFilter("member={0}")
            .contextSource()
                .root("dc=habuma,dc=com");
}
````

LDAP 서버가 시작할 때, 클래스패스 안에서 찾을 수 있는 모든 LDIF 파일에서 데이터를 불러온다.

**LDIF(LDAP Data Interchange Format)**는 LDAP 데이터를 일반 텍스트 파일로 보여 줄 수 있는 표준 방식이다.

각 레코드는 한 줄 이상으로 구성되어 있고, 각각은 이름:값 쌍을 포함하며, 레코드들은 빈 줄로 구분된다.

````java
@Override
protected void configure(AuthenticationManagerBuilder auth)
        throws Exception {
    auth
        .ldapAuthentication()
            .userSearchBase("ou=people")
            .userSearchFilter("(uid={0})")
            .groupSearchBase("ou=groups")
            .groupSearchFilter("member={0}")
            .contextSource()
                .root("dc=habuma,dc=com")
                .ldif("classpath:users.ldif");
}
````

스프링이 클래스패스 안에서 LDIF 파일을 마구 뒤지는 것을 원하지 않는다면 Idif() 메소드를 호출하여 명시적으로 불러올 LDIF 파일을 설정한다.

--------

**사용자** **정의** **사용자** **서비스** **설정**

<br/>

비관계형 데이터베이스에서 사용자를 인증해야할 경우 **UserDetailsService** 인터페이스를 수정하여 구현한다.

**UserDetailsService 인터페이스**

````java
package org.springframework.security.core.userdetails;
 
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
````

여기서 해줄 것은 사용자명으로 사용자를 찾기 위한 메소드인 **loadUserByUsername()**을 구현해주는 것이다.

**loadUserByUsername()**은 주어진 사용자에 대한 **UserDetails** 객체를 반환한다.

<br/>

**Repository로부터 UserDetails 객체 얻어오기**

````java
import java.util.ArrayList;
import java.util.List;
 
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ss.domain.Spitter;
import ss.repository.UserRepository;
 
public class UserService implements UserDetailsService{
    
    private UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
 
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Spitter spitter =  userRepository.findByUsername(username);
        if(spitter!=null){
            List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            
            return new User(
                    spitter.getUsername(),
                    spitter.getPassword(),
                    authorities);
        }
        
        throw new UsernameNotFoundException("User '"+username+"' not found");
    }
}
````

UserService에서 사용자 데이터가 어떻게 유지되고 있는지 알 수 없다는 점이다.

UserRepository는 관계형 데이터베이스나 문서 데이터베이스 혹은 그래프 데이터베이스로부터 Spitter를 검색할 수 있다.

UserService는 어떠한 데이터 저장소가 사용되고 있는지는 알지도 신경 쓰지도 않고 단순히 Spitter 객체를 얻어 오기만 하여 User 객체를 만들기 위해 사용할 뿐이다. (**User**는 **UserDetails**의 **실체** **구현이다**.)

<br/>

UserService를 사용자 인증에 사용하기 위해 userDetailsService() 메소드로 보안 설정을 해 주면 된다.

````java
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
 
    @Autowired
    UserRepository userRepository;
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth
            .userDetailsService(new UserService(userRepository));
    }
}
````

**userDetailsService()** 메소드는 저장소에 대한 설정을 한다.

하지만 스프링에서 제공되는 사용자 저장소 대신 UserDetailsService 구현을 사용한다.