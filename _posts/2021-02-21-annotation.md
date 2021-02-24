---
layout: post
title:  "[Spring]Annotation"
categories: spring
comments: true




---

# Annotation 이란?

<br/>

---------

`Annotation(@)`은 사전적 의미로는 주석이라는 뜻이다.
자바에서 `Annotation`은 코드 사이에 주석처럼 쓰이며 특별한 의미, 기능을 수행하도록 하는 기술이다.
즉, 프로그램에게 추가적인 정보를 제공해주는 메타데이터라고 볼 수 있다.
*`meta data` : 데이터를 위한 데이터)*

다음은 **어노테이션의 용도**를 나타낸 것이다.

**컴파일러에게 코드 작성 문법 에러를 체크하도록 정보를 제공**한다.

소프트웨어 개발 툴이 **빌드나 배치시 코드를 자동으로 생성할 수 있도록 정보를 제공**한다.

**실행시(런타임시)특정 기능을 실행하도록 정보를 제공**한다.

기본적으로 어노테이션을 사용하는 순서는 다음과 같다.

1. **어노테이션을 정의**한다.
2. **클래스에 어노테이션을 배치**한다.
3. **코드가 실행되는 중**에 **Reflection을 이용하여 추가 정보를 획득하여 기능을 실시**한다.

<br/>

<br/>

### Reflection 이란?

<br/>

`Reflection`이란 **프로그램이 실행 중에 자신의 구조와 동작을 검사하고, 조사하고, 수정하는 것**이다.

`Reflection`은 프로그래머가 **데이터를 보여주고, 다른 포맷의 데이터를 처리하고, 통신을 위해 serialization(직렬화)를 수행**하고, **bundling을 하기 위해 일반 소프트웨어 라이브러리를 만들도록 도와준다.**

Java와 같은 객체 지향 프로그래밍 언어에서 **`Reflection`을 사용하면 컴파일 타임에 인터페이스, 필드, 메소드의 이름을 알지 못해도 실행 중에 클래스, 인터페이스, 필드 및 메소드에 접근할 수 있다.**

또한 **새로운 객체의 인스턴스화 및 메소드 호출을 허용**한다.

Java와 같은 객체 지향 프로그래밍 언어에서 **`Reflection`을 사용하여 멤버 접근 가능성 규칙을 무시할 수 있다.**
*[EX] reflection을 사용하면 서드 파티 라이브러리의 클래스에서 private 필드의 값을 변경할 수 있다.*

**Spring에서 BeanFactory라는 Container에서 객체가 호출되면 객체의 인스턴스를 생성하게 되는데 이 때 필요하게 된다. 즉, 프레임워크에서 유연성있는 동작을 위해 쓰인다.**

**`Annotation` 자체는 아무런 동작을 가지지 않는 단순한 표식**일 뿐이지만, **`Reflection`을 이용하면 `Annotation`의 적용 여부와 엘리먼트 값을 읽고 처리**할 수 있다.

**Class에 적용된 `Annotation` 정보를 읽으려면 java.lang.Class를 이용**하고
**필드, 생성자, 메소드에 적용된 어노테이션 정보를 읽으려면 Class의 메소드를 통해 java.lang.reflect 패키지의 배열을 얻어야 한다.**

Class.forName(), getName(), getModifier(), getFields() getPackage() 등등 여러 메소드로 정보를 얻을 수 있다.

**`Reflection`을 이용하면 `Annotation` 지정만으로도 원하는 클래스를 주입할 수 있다.**



````java
// Without reflection
Foo foo = new Foo();
foo.hello();
````

````java
// With reflection
Object foo = Class.forName("complete.classpath.and.Foo").newInstance();
// Alternatively: Object foo = Foo.class.newInstance();
Method m = foo.getClass().getDeclaredMethod("hello", **new** Class<?>[0]);
m.invoke(foo);
````





### @RestController

- `@Controller` 와 `@ResponseBody` 를 합친 어노테이션으로 메소드의 반환 결과를 JSON 형태로 반환해줍니다.



### @RequestMapping

- 요청 URL을 어떤 메소드가 처리할 것인지 매핑해주는 어노테이션입니다.
- Controller나 Controller의 method에 적용한다.
- 요청을 받는 형식인 GET, POST, PATCH, PUT, DELETE 를 정의하기도 한다. (지정 안할 시 GET)



### @Bean

- 스프링 컨테이너에 Bean을 등록하도록 해주는 어노테이션입니다.

- ```
  @Bean
  ```

  - 개발자가 직접 제어 불가능한 외부 라이브러리를 Bean으로 등록하기 위해 사용됩니다.

- ```
  @Component
  ```

  - 개발자가 직접 작성한 클래스를 Bean으로 등록하기 위해 사용됩니다.



### @Autowired

- 생성자나 setter 메소드 없이 의존성을 주입해서 자동으로 객체를 생성해주는 어노테이션입니다.



### @Configuration

- 해당 클래스가 환경 설정과 관련된 파일이라는 것을 알려주는 어노테이션입니다.
- 해당 클래스에 정의된 `@Bean`이 적용된 메소드는 `@Autowired`를 통해서 부를 수 있습니다.



### @ConfigurationProperties

- 프로퍼티 파일을 읽어와서 해당 값들을 사용할 수 있게 만들어줍니다.



### @Transactional

- 해당 클래스 또는 메소드에 트랜잭션을 적용시켜 줍니다.
- DB에 액세스하는 여러 연산들을 하나의 트랜잭션으로 처리하여 오류가 발생하면 자동으로 롤백 시켜 줍니다.



### @Controller

- Presentation Layer
- 요청과 응답을 처리해주는 클래스에 사용됩니다.



### @Service

- Service Layer
- 비즈니스 로직을 담당하는 클래스에 사용됩니다.



### @Repository

- Persistence Layer
- DB에 액세스하는 클래스에 사용됩니다. (DB접근하는 Method를 가지고 있는 class에서 사용(DAO))



### @ExceptionHandler

- 컨트롤러 단에서 발생하는 예외를 잡아서 처리해주는 메소드에 사용됩니다.



### @ControllerAdvice

- 전역에서 발생하는 예외들을 잡아서 처리해주는 클래스에 사용됩니다.



### @ComponentScan

* @Component와 @Service, @Repository, @Controller, @Configuration이 붙은 클래스 Bean들을 찾아서 Context에 bean등록을 해주는 Annotation이다.
* *@Component Annotation이 있는 클래스에 대하여 bean 인스턴스를 생성*

* ApplicationContext.xml에 `<bean id="jeongpro" class="jeongpro" />` 과 같이 xml에 bean을 직접등록하는 방법도 있고 위와 같이 `Annotation`을 붙여서 하는 방법도 있다.

* base-package를 넣으면 해당 패키지 아래에 있는 컴포넌트들을 찾고 그 과정을 spring-context-버전(4.3.11.RELEASE).jar에서 처리한다.

* Spring에서 **@Component로 다 쓰지 않고 @Repository, @Service, @Controller등을 사용하는 이유**는, 예를들어 **@Repository는 DAO의 메소드에서 발생할 수 있는 unchecked exception들을 스프링의 DataAccessException으로 처리할 수 있기 때문**이다.

   **또한 가독성에서도 해당 애노테이션을 갖는 클래스가 무엇을 하는지 단 번에 알 수 있다.**

* **자동으로 등록되는 Bean의 이름은 클래스의 첫문자가 소문자로 바뀐 이름이 자동적용**된다.
  *HomeController -> homeController*



### @Controller 와 @RestController 의 차이

- @Controller
  **API와 view를 동시에 사용하는 경우에 사용**한다.
  **대신 API 서비스로 사용하는 경우는 @ResponseBody를 사용하여 객체를 반환**한다.
  **view(화면) return이 주목적**이다.
- @RestController
  **view가 필요없는 API만 지원하는 서비스에서 사용**한다.
  *Spring 4.0.1부터 제공*
  **@RequestMapping 메서드가 기본적으로 @ResponseBody 의미를 가정**한다.
  **data(json, xml 등) return이 주목적**이다.

**즉, @RestController = @Controller + @ResponseBody 이다.**



### @ModelAttribute

* **view에서 전달해주는 parameter를 Class(VO/DTO)의 멤버 변수로 binding 해주는 Annotation**이다.

* binding 기준은 `<input name="id" />` 처럼 **어떤 태그의 name값이 해당 Class의 멤버 변수명과 일치해야하고 set method명도 일치해야한다.**

````java
class Person{

String id;

public void setId(String id){ this.id = id;}
public String getId(){ return this.id }
}

@Controller
@RequestMapping("/person/*")
public class PersonController{
	@RequestMapping(value = "/info", method=RequestMethod.GET)
    	//view에서 myMEM으로 던져준 데이터에 담긴 id 변수를 Person타입의 person이라는 객체명으로 바인딩.
	public void show(@ModelAttribute("myMEM") Person person, Model model)
	{ model.addAttribute(service.read(person.getId())); }
}
````



### @RequestBody

* **요청이 온 데이터(JSON이나 XML형식)를 바로 Class나 model로 매핑하기 위한 Annotation**이다.

* POST나 PUT, PATCH로 요청을 받을때에, **요청에서 넘어온 body 값들을 자바 타입으로 파싱**해준다.

* **HTTP POST 요청에 대해 request body에 있는 request message에서 값을 얻어와 매핑한다.
  RequestData를 바로 Model이나 클래스로 매핑**한다.

이를테면 **JSON 이나 XML같은 데이터를 적절한 messageConverter로 읽을 때 사용하거나 POJO 형태의 데이터 전체로 받는 경우에 사용**한다.



### @ResponseBody

* **HttpMessageConverter를 이용하여 JSON 혹은 xml 로 요청에 응답할수 있게 해주는 Annotation**이다.
* **view가 아닌 JSON 형식의 값을 응답할 때 사용하는 Annotation**으로 **문자열을 리턴하면 그 값을 http response header가 아닌 response body에 들어간다.**

* 이미 **RestController Annotation이 붙어 있다면, 쓸 필요가 없다.**
  허나 그렇지 않은 단순 컨트롤러라면, **HttpResponse로 응답 할 수 있게 해준다.**

* 만약 **객체를 return하는 경우 JACKSON 라이브러리에 의해 문자열로 변환되어 전송**된다.

* **context에 설정된 viewResolver를 무시한다고 보면된다.**

<br/>

<br/>

[참고]

https://velog.io/@gillog/Spring-Annotation-%EC%A0%95%EB%A6%AC