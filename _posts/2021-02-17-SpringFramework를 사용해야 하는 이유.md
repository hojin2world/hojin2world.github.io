---
layout: post
title:  "[Spring]Spring Framework를 사용해야 하는 이유"
categories: spring
comments: true

---

# Spring Framework를 사용해야 하는 이유

<br/>

--------

### 왜 스프링을 사용해야 하는가?

 <br/>

  첫 번째 글부터 매우 확 막히네요. 우리는 왜 자바 어플리케이션을 만들때 특히 웹 어플리케이션을 만들 때 스프링 프레임워크를 사용할까요? 안타깝게도 정확하게 떠오르지는 않는 것 같습니다. 하지만 반대로 스프링을 사용하지 않고 웹을 만드는 과정을 생각해 보면 조금 그려지기도 하는 것 같습니다. 스프링을 사용하지 않으면 어떻게 만들까요?

  아마도 매우 어렵겠지요? 서블릿도 사용해야 하고 각 객체들의 생성/소멸도 신경을 써 주어야 하고 변경에 대하여 유연하게 대응하려면 여러가지 패턴들도 내가 직접 짜야 할 것 같습니다. 거기에 다가 인증/보안/로깅 등 공통으로 필요한 모듈들은 직접 만들어야 할 것 같습니다.

  또한 여러가지 쏟아지는 새로운 모듈들을 활용하려면 많은 노력들이 필요할 것 같습니다. 아마도 반영을 못할 것 같은 느낌이 드네요. 아마도 한국의 개발자들은 집에 들어가지 못할 것 같습니다.

  그리고 마지막으로 좋은 개발자가 개발한 프로그램과 나쁜 개발자가 개발한 프로그램은 많은 차이가 날 것 같습니다. 또한 여러 사람들이 각각 자기만의 패턴과 자기만의 스타일대로 프로그램을 만들 것이고 아마도 수많은 해설에 대한 문제가 없다면 유지보수 / 다른 사람이 만들 코드들에 대한 분석이 아마도 불가능 할 것 같습니다.

아래와 같이 다시 한번 정리해 보도록 하겠습니다.

<br/>

> 변경에 대한 적응력

- DI
  많이 들어보셨겠지만 DI, IOC를 이용한 변경에 대하여 좀 더 유연하게 대응이 가능합니다.
- Portable Service Abstraction
  만약 오늘까지는 Hibernate로 ORM모듈을 사용해다가 내일 EclipseLink로 모듈이 변경되었다면, 혹은 오늘까지는 log4로 로깅을 남기다다 내일부터는 logback으로 남기고 싶을 때 스프링은 쉽게 이를 적용할 수 있습니다. 왜? Spring 별도의 추상화된 라이브러리를 적용하고 그를 이용하여 다른 라이브러리를 사용하기 때문입니다. 메시징에 대해서도 동일하게 유연하게 적용이 가능합니다.



> 엔터프라이즈급 서비스를 위한 모듈 제공

- AOP
  관점지향프로그램(추후 다시 설명), 로깅/보안/트랜젹션 공통 처리
- Logging System
  전문적인 로깅, Log4j나 Logback을 쉽게 적용할 수 있음.
- 보안(Spring Security) / 배치(Spring Batch) / EIP(Spring Integration)
  
- 다양한 View Template 엔진 적용 : JSP, Thymeleaf
  (물론 스프링을 안써도 적용할 수 있으나 쉽게 적용할 수 있다는 이야기.)



> 많은 예제

- Spring.io : [Spring 공식 사이트(https://projects.spring.io/spring-framework/)](https://projects.spring.io/spring-framework/)
- StackOverflow : [Q/A 모음 사이트](http://stackoverflow.com/)
- Spring Communite : http://forum.spring.io/



> Bean 관리

- 기존 J2ee에서는 POJO를 사용할 수 없었으나 Spring은 이를 사용 가능함.
- 빈의 라이프사이클 관리
  프로그램에서 사용하는 수 많은 Bean에 대한 라이프사이클을 관리(라이프사이클)해 주며 Autowire란 어노테이션을 제공하여 Bean들을 쉽게 이용할 수 있음.



> 특징

* 크기와 부하의 측면에서 경량.
* 제어 역행(IoC)이라는 기술을 통해 애플리케이션의 느슨한 결합을 도모.
* 관점지향(AOP) 프로그래밍을 위한 풍부한 지원을 함.
* 애플리케이션 객체의 생명 주기와 설정을 포함하고 관리한다는 점에서 일종의 컨테이너(Container)라고 할 수 있음.
* 간단한 컴포넌트로 복잡한 애플리케이션을 구성하고 설정할 수 있음.



* **-스프링의 특징을 좀 더 상세히 말하자면 -**

  1)  경량 컨테이너로서 자바 객체를 직접 관리.

    각각의 객체 생성, 소멸과 같은 라이프 사이클을 관리하며 스프링으로부터 필요한 객체를 얻어올 수 있다.

  

  2)  스프링은 POJO(Plain Old Java Object) 방식의 프레임워크.

    일반적인 J2EE 프레임워크에 비해 구현을 위해 특정한 인터페이스를 구현하거나 상속을 받을 필요가 없어 기존에 존재하는 라이브러리

    등을 지원하기에 용이하고 객체가 가볍다.

  

  3)  스프링은 제어 반전(IoC : Inversion of Control)을 지원.

    컨트롤의 제어권이 사용자가 아니라 프레임워크에 있어서 필요에 따라 스프링에서 사용자의 코드를 호출한다.

  

  4)  스프링은 의존성 주입(DI : Dependency Injection)을 지원

    각각의 계층이나 서비스들 간에 의존성이 존재할 경우 프레임워크가 서로 연결시켜준다.

  

  5)  스프링은 관점 지향 프로그래밍(AOP : Aspect-Oriented Programming)을 지원

    따라서 트랜잭션이나 로깅, 보안과 같이 여러 모듈에서 공통적으로 사용하는 기능의 경우 해당 기능을 분리하여 관리할 수 있다.

  
  
  6)  스프링은 영속성과 관련된 다양한 서비스를 지원
  
    iBatis나 Hibernate 등 이미 완성도가 높은 데이터베이스 처리 라이브러리와 연결할 수 있는 인터페이스를 제공한다.
  
  
  
  7)  스프링은 확장성이 높음.
  
    스프링 프레임워크에 통합하기 위해 간단하게 기존 라이브러리를 감싸는 정도로 스프링에서 사용이 가능하기 때문에 수많은 라이브러리
  
    가 이미 스프링에서 지원되고 있고 스프링에서 사용되는 라이브러리를 별도로 분리하기도 용이하다.

<br/>

<br/>

  [참고]

- http://a07274.tistory.com/200
- http://www.wrox.com/WileyCDA/Section/Why-Use-the-Spring-Framework-.id-130098.html
- [http://www.tothenew.com/blog/why-should-you-adopt-spring-framework](http://www.tothenew.com/blog/why-should-you-adopt-spring-framework/)
- https://opentutorials.org/course/2428/13633
-  https://ooz.co.kr/170?category=818548
- http://ko.wikipedia.org/wiki/%EC%8A%A4%ED%94%84%EB%A7%81_%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC