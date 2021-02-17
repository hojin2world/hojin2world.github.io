---
layout: post
title:  "[Spring] closure()"
categories: spring
comments: true

---

# Spring Framework를 사용해야 하는 이유



#### 왜 스프링을 사용해야 하는가?

 

  첫 번째 글부터 매우 확 막히네요. 우리는 왜 자바 어플리케이션을 만들때 특히 웹 어플리케이션을 만들 때 스프링 프레임워크를 사용할까요? 안타깝게도 정확하게 떠오르지는 않는 것 같습니다. 하지만 반대로 스프링을 사용하지 않고 웹을 만드는 과정을 생각해 보면 조금 그려지기도 하는 것 같습니다. 스프링을 사용하지 않으면 어떻게 만들까요?

  아마도 매우 어렵겠지요? 서블릿도 사용해야 하고 각 객체들의 생성/소멸도 신경을 써 주어야 하고 변경에 대하여 유연하게 대응하려면 여러가지 패턴들도 내가 직접 짜야 할 것 같습니다. 거기에 다가 인증/보안/로깅 등 공통으로 필요한 모듈들은 직접 만들어야 할 것 같습니다.

  또한 여러가지 쏟아지는 새로운 모듈들을 활용하려면 많은 노력들이 필요할 것 같습니다. 아마도 반영을 못할 것 같은 느낌이 드네요. 아마도 한국의 개발자들은 집에 들어가지 못할 것 같습니다.

  그리고 마지막으로 좋은 개발자가 개발한 프로그램과 나쁜 개발자가 개발한 프로그램은 많은 차이가 날 것 같습니다. 또한 여러 사람들이 각각 자기만의 패턴과 자기만의 스타일대로 프로그램을 만들 것이고 아마도 수많은 해설에 대한 문제가 없다면 유지보수 / 다른 사람이 만들 코드들에 대한 분석이 아마도 불가능 할 것 같습니다.

아래와 같이 다시 한번 정리해 보도록 하겠습니다.

> 변경에 대한 적응력

- DI
  많이 들어보셨겠지만 DI, IOC를 이용한 변경에 대하여 좀 더 유연하게 대응이 가능합니다. 해당에 대한 상세 사유는 차후 실습에서 좀더 상세하게 적어보도록 하겠습니다.
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



참고사이트

- http://a07274.tistory.com/200
- http://www.wrox.com/WileyCDA/Section/Why-Use-the-Spring-Framework-.id-130098.html
- [http://www.tothenew.com/blog/why-should-you-adopt-spring-framework](http://www.tothenew.com/blog/why-should-you-adopt-spring-framework/)
- https://opentutorials.org/course/2428/13633