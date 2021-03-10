---
layout: post
title:  "[Spring] AOP (Aspect Oriented Programming)"
categories: spring
comments: true


---

# SpringSecurity - AOP (Aspect Oriented Programming)

-------------

<br/>

## AOP



**AOP**는 **Aspect Oriented Programming**의 약자로 **관점 지향 프로그래밍**이라고 불린다. 
관점 지향은 쉽게 말해 **어떤 로직을 기준으로 핵심적인 관점, 부가적인 관점으로 나누어서 보고 그 관점을 기준으로 각각 모듈화하겠다는 것이다**.
여기서 **모듈화**란 어떤 **공통된 로직이나 기능을 하나의 단위로 묶는 것**을 말한다.

Spring의 핵심 개념중 하나인 DI가 애플리케이션 모듈들 간의 결합도를 낮춰준다면, **AOP**는 **애플리케이션 전체에 걸쳐 사용되는 기능을 재사용**하도록 지원하는 것이다.

<br/>

예로들어 핵심적인 관점은 결국 우리가 적용하고자 하는 핵심 비즈니스 로직이 된다. 또한 부가적인 관점은 핵심 로직을 실행하기 위해서 행해지는 데이터베이스 연결, 로깅, 파일 입출력 등을 예로 들 수 있다.

- OOP : 비지니스 로직의 모듈화
  - 모듈화의 핵심 단위는 비지니스 로직
- AOP : 인프라 혹은 부가기능의 모듈화
  - 대표적 예 : 로깅, 트랜잭션, 보안 등
  - 각각의 모듈들의 주 목적 외에 필요한 부가적인 기능들

<br/>

**AOP**에서 각 관점을 기준으로 로직을 모듈화한다는 것은 코드들을 부분적으로 나누어서 모듈화하겠다는 의미다. 이때, 소스 코드상에서 다른 부분에 계속 반복해서 쓰는 코드들을 발견할 수 있는 데 이것을 **흩어진 관심사 (Crosscutting Concerns)**라 부른다. 

<br>

![img1 daumcdn](https://user-images.githubusercontent.com/38201897/110594343-030fc080-81c0-11eb-8b1b-ed6ffbf2158e.png)

위와 같이 흩어진 관심사를 **Aspect로 모듈화하고 핵심적인 비즈니스 로직에서 분리하여 재사용하겠다는 것이 AOP의 취지**다.

<br/>

**AOP 주요 개념**

- Aspect : 위에서 설명한 흩어진 관심사를 모듈화 한 것. 주로 부가기능 모듈을 Aspect라고 부르며 
  핵심기능에 부가되어 의미를 갖는 특별한 모듈이라 생각하면 된다.

- Target : Aspect를 적용하는 곳 (클래스, 메서드 .. )

- Advice : 실질적으로 어떤 일을 해야할 지에 대한 것, 실질적인 부가기능을 담은 구현체

  * Advice의 경우 타겟 오프젝트에 종속되지 않기 때문에 순수하게 **부가기능에만 집중**할 수 있다.

  * Advice는 Aspect가 "무엇을", "언제" 할지를 의미하고 있다.

- JointPoint : Advice가 적용될 위치, 끼어들 수 있는 지점. 메서드 진입 지점, 생성자 호출 시점, 필드에서 값을 꺼내올 때 등 다양한 시점에 적용가능 , Spring에서는 **메소드 조인포인트만 제공**

- PointCut : JointPoint의 상세한 스펙을 정의한 것. 'A란 메서드의 진입 시점에 호출할 것'과 같이 더욱 구체적으로 Advice가 실행될 지점을 정할 수 있음  **(부가기능이 적용될 대상(메소드)를 선정하는 방법을 얘기한다.)**
  즉, 어드바이스를 적용할 조인포인트를 선별하는 기능을 정의한 모듈을 얘기한다.

  (어드바이스의 value로 들어간 문자열을 포인트컷 표현식이라고 한다.)

  * 포인트컷 표현식은 2가지로 나눠지는데, `execution`을 **지정자**라고 부른다.
  * `(* com.hojin2world..*.EventService.*(..)))`는 **타겟 명세**라고 한다.

- Proxy : 타겟을 감싸서 타겟의 요청을 대신 받아주는 랩핑(Wrapping) 오브젝트이다.
  호출자 (클라이언트)에서 타겟을 호출하게 되면 타겟이 아닌 타겟을 감싸고 있는 Proxy가 호출되어, 타겟 메소드 실행전에 선처리, 타겟 메소드 실행 후, 후처리를 실행시키도록 구성되어있다.
  ![img1 daumcdn](https://user-images.githubusercontent.com/38201897/110597799-5d128500-81c4-11eb-8f5a-46b56e61d299.png)

(AOP에서 프록시는 호출을 가로챈 후, 어드바이스에 등록된 기능을 수행 후 타겟 메소드를 호출한다.)

<br/>

**AOP 특징**

- 프록시 패턴 기반의 AOP 구현체, 프록시 객체를 쓰는 이유는 접근 제어 및 부가기능을 추가하기 위해서임
- 스프링 빈에만 AOP를 적용 가능
- 모든 AOP 기능을 제공하는 것이 아닌 스프링 IoC와 연동하여 엔터프라이즈 애플리케이션에서 가장 흔한 문제(중복코드, 프록시 클래스 작성의 번거로움, 객체들 간 관계 복잡도 증가 ...)에 대한 해결책을 지원하는 것이 목적

<br/>

**AOP의 장점**

- 어플리케이션 전체에 흩어진 공통 기능이 하나의 장소에서 관리된다는 점
- 다른 서비스 모듈들이 본인의 목적에만 충실하고 그외 사항들은 신경쓰지 않아도 된다는 점

<br/>

**스프링 AOP : @AOP**

스프링 **@AOP**를 사용하기 위해서는 다음과 같은 의존성을 추가해야 한다. 

````java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
````

<br/>

다음에는 아래와 같이 **@Aspect** 어노테이션을 붙여 이 클래스가 **Aspect**를 나타내는 클래스라는 것을 명시하고 **@Component**를 붙여 스프링 빈으로 등록한다.

````java
@Component
@Aspect
public class PerfAspect {

// Around -> 어드바이스 (Advice는 Aspect가 "무엇을", "언제" 할지를 의미하고 있다.)
// 여기서 "무엇"은 logPerf() 메소드를 나타낸다.
/* 그리고 "언제"는 @Around가 되는데 , 이 언제라는 시점의 경우 @Around만 존재하지 않고 총 5가지의
   타입이 존재한다. @Before, @After ... */ 
// execution -> 포인트컷 지정자 
// *리턴 타입을 나타낸다.            현재 : 모든 타입 리턴 가능 
// com.hojin2world..*.EventService.* 타겟이 되는 메소드 지정 
// (..) -> 인자(argument)타입      현재 : 모든 타입 인자 허용
@Around("execution(* com.hojin2world..*.EventService.*(..))")
public Object logPerf(ProceedingJoinPoint pjp) throws Throwable{
			long begin = System.currentTimeMillis();
			Object retVal = pjp.proceed(); // 메서드 호출 자체를 감쌈
			System.out.println(System.currentTimeMillis() - begin);
			return retVal;
	}
}
````

**@Around** 어노테이션은 타겟 메서드를 감싸서 특정 **Advice**를 실행한다는 의미이다. 위 코드의 **Advice**는 타겟 메서드가 실행된 시간을 측정하기 위한 로직을 구현하였다. 추가적으로 **execution(\* com.hojin2world..\*.EventService.\*(..))**가 의미하는 바는 **com.hojin2world** 아래의 패키지 경로의 **EventService** 객체의 모든 메서드에 이 **Aspect**를 적용하겠다는 의미다.



````java
public interface EventService {
    void createEvent();
    void publishEvent();
    void deleteEvent();
}
````

````java
@Component
public class SimpleEventService implements EventService {
    
    @Override
    public void createEvent() {
        try {
            Thread.sleep(1000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Created an event");
    }

    @Override
    public void publishEvent() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e){
            e.printStackTrace();;
        }
        System.out.println("Published an event");
    }

    public void deleteEvent() {
        System.out.println("Delete an event");
    }
}
````

````java
@Service
public class AppRunner implements ApplicationRunner {

    @Autowired
    EventService eventService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        eventService.createEvent();
        eventService.publishEvent();
        eventService.deleteEvent();
    }
}
````

````
Created an event
1003
Published an event
1000
Delete an event
0
````

<br/>

또한 경로지정 방식말고 특정 어노테이션이 붙은 포인트에 해당 **Aspect**를 실행할 수 있는 기능도 제공한다. 

````java
@Component
@Aspect
public class PerfAspect {   
@Around("@annotation(PerLogging)")
public Object logPerf(ProceedingJoinPoint pjp) throws Throwable{
			long begin = System.currentTimeMillis();
			Object retVal = pjp.proceed(); // 메서드 호출 자체를 감쌈
			System.out.println(System.currentTimeMillis() - begin);
			return retVal;
	}
}
````

````java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
	public @interface PerLogging {
}
````

````java
@Component
public class SimpleEventService implements EventService {

    @PerLogging
    @Override
    public void createEvent() {
        try {
            Thread.sleep(1000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Created an event");
    }

    @Override
    public void publishEvent() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e){
            e.printStackTrace();;
        }
        System.out.println("Published an event");
    }

    @PerLogging
    @Override
    public void deleteEvent() {
        System.out.println("Delete an event");
    }
}
````

````java
Created an event
1003
Published an event
Delete an event
0
````

위 출력 결과에서 **@PerLogging** 어노테이션이 붙은 메서드만 **Aspect**가 적용된 것을 볼 수 있다.

<br/>

마찬가지로 스프링 빈의 모든 메서드에 적용할 수 있는 기능도 제공한다.

````java
@Component
@Aspect
public class PerfAspect {

@Around("bean(simpleEventService)")
public Object logPerf(ProceedingJoinPoint pjp) throws Throwable{
			long begin = System.currentTimeMillis();
			Object retVal = pjp.proceed(); // 메서드 호출 자체를 감쌈
			System.out.println(System.currentTimeMillis() - begin);
		return retVal;
	}
}
````

````java
@Component
public class SimpleEventService implements EventService {

    @Override
    public void createEvent() {
        try {
            Thread.sleep(1000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Created an event");
    }

    @Override
    public void publishEvent() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e){
            e.printStackTrace();;
        }
        System.out.println("Published an event");
    }
    
    @Override
    public void deleteEvent() {
        System.out.println("Delete an event");
    }
}
````

````java
@Service
public class AppRunner implements ApplicationRunner {

    @Autowired
    EventService eventService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        eventService.createEvent();
        eventService.publishEvent();
        eventService.deleteEvent();
    }
}
````

````java
Created an event
1002
Published an event
1001
Delete an event
0
````

위 출력결과로 **SimpleEventService**의 모든 메서드에 해당 **Aspect**가 추가된 것을 알 수 있다.

<br/>

이 밖에도 **@Around** 외에 타겟 메서드의 **Aspect** 실행 시점을 지정할 수 있는 어노테이션이 있다. 

- @Before (이전) : 어드바이스 타겟 메소드가 호출되기 전에 어드바이스 기능을 수행

- @After (이후) : 타겟 메소드의 결과에 관계없이(즉 성공, 예외 관계없이) 타겟 메소드가 완료 되면 어드바이스 기능을 수행
- @AfterReturning (정상적 반환 이후)타겟 메소드가 성공적으로 결과값을 반환 후에 어드바이스 기능을 수행
- @AfterThrowing (예외 발생 이후) : 타겟 메소드가 수행 중 예외를 던지게 되면 어드바이스 기능을 수행
- @Around (메소드 실행 전후) : 어드바이스가 타겟 메소드를 감싸서 타겟 메소드 호출전과 후에 어드바이스 기능을 수행
  * **@Around의 경우 반드시 proceed() 메소드가 호출되어야 한다.**
  * **proceed()** 메소드는 타겟 메소드를 지칭하기 때문에 proceed 메소드를 실행시켜야만 타겟 메소드가 수행이 된다는것을 잊지 말자.

````java
//예를 들어 타겟 메소드의 이전 시점에서만 어드바이스 메소드를 수행하고 싶다면,
@Before("포인트컷 표현식")
public void 어드바이스메소드() {
    ....
}
````



<br/>

reference

````
https://engkimbs.tistory.com/746 
https://jojoldu.tistory.com/71
````

