---
layout: post
title:  "[Spring] MVC Model2"
categories: spring 
comments: true

---

# Spring MVC MODEL2

![mvc2_1](https://user-images.githubusercontent.com/38201897/108438600-f0762b80-7292-11eb-84f5-ca129d9a7364.png)

**Model(모델) **

어플리케이션의 데이터이며, 모든 데이터 정보를 가공하여 가지고 있는 컴포넌트이다.

- 사용자가 이용하려는 모든 데이터를 가지고 있어야하며, View(뷰) 또는 Controller(컨트롤러)에 대해 어떤 정보도 알 수 없어야 한다.
- 변경이 일어나면 처리 방법을 구현해야 한다.

 <br/>

 **View(뷰)**

시각적인 UI 요소를 지칭하는 용어이다.

- Model(모델)이 가지고 있는 데이터를 저장하면 안된다.
- Model(모델)이나 Controller(컨트롤러)에 대한 정보를 알면 안되며 단순히 표시해주는 역할을 가지고 있다.
- 변경이 일어나면 처리 방법을 구현해야 한다.

<br/>

**Controller(컨트롤러)**

Model(모델)과 View(뷰)를 연결해주는 역할을 한다.

- Model(모델) 또는 View(뷰)에 대한 정보를 알아야 한다.
- Model(모델) 또는 View(뷰)의 변경을 인지하여 대처를 해야한다.

<br/>

````
모델2의 패턴은

어떤 요청이 들어오면 컨트롤러가 요청을 받고 요청에 해당하는 모델을 호출하게 됩니다. 호출된 모델은 데이터들을 처리한 후 컨트롤러에게 요청에 대한 결과(응답)를 보내고 컨트롤러는 뷰에게 전송하는 원리입니다.

(요청 -> 프론트 컨트롤러 -> 핸들러 매핑 -> 핸들러 어댑터 -> 컨트롤러 -> 로직 수행(서비스) -> 컨트롤러 -> 뷰 리졸버 -> 응답(jsp, html))
````

<br/>



![mvc2_2](https://user-images.githubusercontent.com/38201897/108438592-ef44fe80-7292-11eb-8039-5443ceb6cb37.png)

<br/>

**MVC의 처리 순서**

1. 클라이언트가 서버에 요청을 하면, front controller인 DispatcherServlet 클래스가 요청을 받는다.
2. DispatcherServlet는 프로젝트 파일 내의 servlet-context.xml 파일의 @Controller 인자를 통해 등록한 요청 위임 컨트롤러를 찾아 매핑(mapping)된 컨트롤러가 존재하면 @RequestMapping을 통해 요청을 처리할 메소드로 이동한다.
3. 컨트롤러는 해당 요청을 처리할 Service(서비스)를 받아 비즈니스로직을 서비스에게 위임한다.
4. Service(서비스)는 요청에 필요한 작업을 수행하고, 요청에 대해 DB에 접근해야한다면 DAO에 요청하여 처리를 위임한다.
5. DAO는 DB정보를 DTO를 통해 받아 서비스에게 전달한다.
6. 서비스는 전달받은 데이터를 컨트롤러에게 전달한다.
7. 컨트롤러는 Model(모델) 객체에게 요청에 맞는 View(뷰) 정보를 담아 DispatcherServlet에게 전송한다.
8. DispatcherServlet는 ViewResolver에게 전달받은 View정보를 전달한다.
9. ViewResolver는 응답할 View에 대한 JSP를 찾아 DispatcherServlet에게 전달한다.
10. DispatcherServlet는 응답할 뷰의 Render를 지시하고 뷰는 로직을 처리한다.
11. DispatcherServlet는 클라이언트에게 Rendering된 뷰를 응답하며 요청을 마친다.

<br/>

**Front Controller의 역할은 서버로 들어오는 모든 요청을 받아서 처리합니다.**

공통 처리 작업을 먼저 수행 한 후 적절한 세부컨트롤러에게 작업을 위임해주고 예외 발생시 일관된 방식으로 에러를 처리해주는 일을 합니다.

이런 일들을 하기 때문에 각 컨트롤러들 사이의 중복된 코드 문제나 협업시 개발자들의 개발 방식이 다른 경우 등을 해결을 할 수 있습니다.

<br/>

**스프링에서 제공하는 FrontController인 DispatcherServlet의 역할은 무엇일까요??**

DispatcherServlet의 등장으로 엄청나게 **web.xml의 역할**이 축소 된 것입니다.

DispatcherServlet가 있기전에는 사용자의 URL을 일일이 요청을 처리하기 위해

web.xml에 등록(서블릿과 매핑시켜주는 작업)을 반드시 해야했었습니다.



그렇다고 web.xml이 안쓰이는 것은 아닙니다.

web.xml에서 자주 쓰이는 서블릿 매핑을 DispatcherServlet이 한다고 생각하시면 되고

나머지 web.xml의 기능들은 그대로 web.xml을 이용하신다고 생각하시면됩니다.

(web.xml의 기능은 DispatcherServlet등록, 객체의 URL범위 , 필터 등이 있습니다.)

<br/>

### Spring MVC 구현

* DispatcherServlet 을 frontController로 세팅

````java
<!-- web.xml -->

<?xml version="1.0" encoding="UTF-8"?>
<web-app>
  <display-name>Spring JavaConfig Sample</display-name>

  <servlet>
    <!-- 2. 해당 서블릿의 구현체는 DispatcherServlet 로 정의-->
    <servlet-name>mvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!-- 3. contextClass는 AnnotationConfigWebApplicationContext 를 사용-->
    <init-param>
      <param-name>contextClass</param-name>
      <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
    </init-param>
    <!-- 4. context 에 대해 따로 설정해둔 클래스의 위치를 파라미터로 줌.
    여기서는 사용자가 정의한 WebMvcContextConfiguration 을 사용-->
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>kr.or.connect.mvcexam.config.WebMvcContextConfiguration</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>

  <servlet-mapping>
    <!-- 1. / 로 들어오는 요청은 mvc 라는 이름의 servlet 이 처리-->
    <servlet-name>mvc</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
</web-app>
````

````java
// WebMvcContextConfiguration.java

package org.example.guestbook.config;

...

// 설정 파일임을 Spring이 알게함.
@Configuration 
// Web에 필요한 빈들을 대부분 자동으로 설정. 주로 아래처럼 커스텀으로 설정해야할 때, WebMvcConfigurerAdapter 를 상속받아 클래스로 구현
@EnableWebMvc
// 해당 패키지에 정의된 클래스중 컴포넌트들을 빈으로 등록해놓음.
// @Controller, @Service, @Repository, @Component 가 달린 객체를 찾음. 
@ComponentScan(basePackages = { "kr.or.connect.mvcexam.controller" })
public class WebMvcContextConfiguration extends WebMvcConfigurerAdapter {

    // 자바 파일이 아닌, Resource 파일들에 대한 url 요청이 왔을 경우, 해당 경로에서 찾을 수 있게 설정
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/META-INF/resources/webjars/").setCachePeriod(31556926);
        registry.addResourceHandler("/css/**").addResourceLocations("/css/").setCachePeriod(31556926);
        registry.addResourceHandler("/img/**").addResourceLocations("/img/").setCachePeriod(31556926);
        registry.addResourceHandler("/js/**").addResourceLocations("/js/").setCachePeriod(31556926);
      }

    // default servlet handler를 사용하게 함
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    // / 로 접근시 main 템플릿(jsp) 로 가게함.
    @Override
    public void addViewControllers(final ViewControllerRegistry registry) {
        System.out.println("addViewControllers가 호출됩니다. ");
        registry.addViewController("/").setViewName("main");
    }

    // 렌더링되는 view 파일들의 경로와 확장자명 설정
    @Bean
    public InternalResourceViewResolver getInternalResourceViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
````

<br/>

#### 이외 모듈 구성



**config/**

- 각종 설정 클래스 파일들을 담고 있음.
- 클래스 앞에 `@Configuration` 이 붙음.
- WebMvc 설정 관련 Config 를 제외하고 나머지는 모듈화한 뒤 Application 에서 모두 import
- `@Controller` 관련 빈들은 `WebMvcContextConfiguration` 에서 `@ComponentScan` 으로 찾아줘야하고,
  `@Service`, `@Service`, `@Component` 관련 빈들은 `ApplicationConfig` 에서 찾아줘야 함.



**controller/**

- 각종 컨트롤러 클래스 파일들을 담고 있음.
- 클래스 앞에 `@Controller` 가 붙음.
- 각 컨트롤러 코드는 URI 매핑을 담당.
- Serivce 인스턴스를 가져와 로직을 실행하고, View 단에 나가기 전후 작업을 담당



**dto/**

- 데이터를 모델링한 클래스 파일들을 담고있음.
- 필드(프로퍼티)와 Getter, Setter 를 가짐.



**dao/**

- DB 에 대해 접근할 때 사용하는 클래스 파일들을 담고 있음.
- 클래스 앞에 `@Repository` 가 붙음.
- 실제 dao 클래스와, 사용할 SQL 만을 담고있는 클래스가 따로 모듈화해서 사용함.



**service/**

- 서비스 로직을 담는 클래스 파일들을 담고있음.
- 클래스 앞에 `@Service` 가 붙음.
- Interface로 핵심 로직 먼저 정의한 후, 클래스로 구현.
- 필요한 경우, `Dao` 를 직접 사용하는 클래스임.



**webapp/WEB-INF/views/**

- 렌더링 되는 뷰 관련 파일(`.jsp`)들을 담고있음.
- 이 파일들은 뷰 리졸버를 거쳐, 최종적으로 렌더링 되기 직전의 파일임.



<br/><br/>

[참조]

https://min-it.tistory.com/7