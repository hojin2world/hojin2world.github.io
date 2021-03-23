---
layout: post
title:  "[Spring] SpEL - Spring Expression Language"
categories: spring
comments: true


---

## SpEL(Spring Expression Language)란?

<Br/>

Spring expression language는 보통 SpEL로 표기하며 구두로는 스프링 EL이라고 지칭한다.

SpEL은 보통 객체를 조회하고 조작하는 기능을 제공하여 [Unified EL](https://docs.oracle.com/javaee/5/tutorial/doc/bnahq.html)과 유사하지만 메소드 호출, 문자열 템플릿 기능 등의 여러가지 추가 기능을 제공하는 표현식 언어이다.

OGNL, MVEL, JBoss EL 등 자바에서 사용가능한 여러 EL이 있지만 SpEL은 Spring 프로젝트 전반에 걸쳐 사용하기 위해 만들어졌으며 **스프링 3.0**부터 지원된다.

<br/>

## SpEL 표기법

````
#{SpEL표현식}
````

JSP에서 EL을 사용해서 객체의 프로퍼티를 꺼낼때 ${ } 이라고 표기하듯 SpEL은 #{ }로 표기한다.

\#{ } 안의 내용을 SpEL 표현식으로 인식해서 표현식을 evaluation(평가, 실행) 한다.

참고로 스프링에서 ${ } 표기도 사용되는데 이는 SpEL이 아니라 프로퍼티를 참조할때 사용한다.

SpEL은 기본적으로 #{ } 로 표기한다는 것을 기억해두자.

<br/>

## SpEL 지원 기능

- 리터럴 표현식 (Literal Expression)
- Boolean과 관계연산자 (Boolean and Relational Operator)
- 정규 표현식 (Regular Expression)
- 클래스 표현식 (Class Expression)
- 프로퍼티, 배열, 리스트, 맵에 대한 접근 지원 (Accessing properties, arrays, lists, maps)
- 메서드 호출 (Method Invocation)
- 관계연산자 (Relational Operator)
- 할당 (Assignment)
- 생성자 호출 (Calling Constructors)
- Bean 참조 (Bean References)
- 배열 생성 (Array Contruction)
- 인라인 리스트/맵 (Inline List/Map)
- 삼항 연산자 (Ternary Operator)
- 변수 (Variables)
- 사용자 정의 함수 (User defined functions)
- Collections Projection
- Collections Selection
- Templated expression

<br/>

## @Value 애노테이션에서 SpEL 사용

SpEL이 실질적으로 많이 사용되는 곳 중 하나는 @Value 애노테이션이다.

````java
@Value("#{1+1}")
int value;
 
@Value("#{'hello ' + 'world'}")
String greeting;
 
@Value("#{1 eq 5}")
boolean trueOrFalse;
 
@Value("Literal String")
String literalString;
 
@Override
public void run(ApplicationArguments args) throws Exception {
    System.out.println(value);
    System.out.println(greeting);
    System.out.println(trueOrFalse);
    System.out.println(literalString);
}
````

````
실행 결과
2
hello world
false
Literal String
````

빈이 만들어질때 @Value() 안의 값이 #{ } 표기로 감싸져있으면 SpEL로 파싱하고 평가(실행)해서 결과값을 변수에 할당한다.

<br/>

## SpEL과 프로퍼티

SpEL은 프로퍼티를 가질 수 있지만 반대는 불가능하다.

````java
my.value=100
````

````java
@Value("#{'${my.value}' eq '100'}")
boolean isEqual;
 
@Override
public void run(ApplicationArguments args) throws Exception {
    System.out.println(isEqual);
}
````

````
실행 결과
true
````

<br/>

## Bean Reference(빈 참조) 방법

\#{빈id.프로퍼티} 형식으로 참조한다.

````java
import org.springframework.stereotype.Component;
 
@Component
public class Sample {
    
    private int value = 123;
 
    public int getValue() {
        return value;
    }
}
````

````java
@Value("#{sample.Value}")
int sampleValue;
 
@Override
public void run(ApplicationArguments args) throws Exception {
    System.out.println(sampleValue);
}
````

````
실행 결과
123
````

<br/>

## Expression을 이용한 SpEL 파싱

````java
ExpressionParser parser = new SpelExpressionParser();
Expression expression = parser.parseExpression("1+1");
Object value = expression.getValue();
System.out.println(value);    // 2
````

ExpressionParser의 구현체 SpelExpressionParser로 SpEL의 내용을 파싱(Parsing) 하고 Expression의 getValue() 메서드를 이용해 파싱된 결과값을 Object 타입으로 얻을 수 있다.

````java
ExpressionParser parser = new SpelExpressionParser();
Expression expression = parser.parseExpression("1+1");
int value = expression.getValue(Integer.class);
System.out.println(value);  // 2
````

getValue() 호출 시 Class정보를 넘기면 자동으로 타입 캐스팅이 가능하다.

<br/>

## EvaluationContext를 이용한 SpEL 파싱

````java
// name, nationality를 파라미터로 갖는 생성자
Inventor tesla = new Inventor("Nikola Tesla","Serbian");
 
ExpressionParser parser = new SpelExpressionParser();
Expression exp = parser.parseExpression("name"); // name 프로퍼티
 
// Context에 tesla객체를 넣어준다.
EvaluationContext context = new StandardEvaluationContext(tesla);
String name1 = (String) exp.getValue(context); //name = "Nikola Tesla"
System.out.println(name1);  // Nikola Tesla
 
// getValue 메서드 호출 시 StandardEvaluationContext를 사용하지 않고 객체를 직접 지정
String name2 = (String) exp.getValue(tesla);
System.out.println(name2);  // Nikola Tesla
````

StandardEvaluationContext에 name 프로퍼티가 평가 될 객체를 지정한다. (name1)

StandardEvaluationContext를 사용하지 않고 getValue()에 객체를 직접 지정할 수도 있다.(name2)

StandardEvaluationContext를 사용하는 경우 생성 비용이 발생하지만 필드에 대해 캐싱하기 때문에 반복적으로 사용하면 표현식 파싱이 더 빠르다는 장점이 있다.

 

💡 SpEL도 해당하는 타입으로 변환할 때 ConversionService를 사용한다