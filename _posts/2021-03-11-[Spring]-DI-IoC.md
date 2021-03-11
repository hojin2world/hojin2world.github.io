---
layout: post
title:  "[Spring] DI / IoC"
categories: spring
comments: true



---

# Spring - DI / IoC

-------------

<br/>

### IoC

<br/>

**IoC란 Inversion of Control**의 줄임말로 한글로 번역하면 **제어의 역전**이라는 말이다.

**"제어의 역전"** 이라는 의미는 말 그대로 메소드나 객체의 호출작업을 개발자가 결정하는 것이 아니라,

**외부에서 결정되는 것**을 의미한다.

* 객체의 생성, 생명주기의 관리까지 모든객체에 대한 제어권이 바뀌었다는 것을 의미한다.

* 컴포넌트 의존관계 결정(component dependency resolution),

  설정(configuration) 및 생명주기(lifecycle)를 해결하기 위한 디자인 패턴(Design Pattern)이다.



제어의 역전 개념은 이미 폭넓게 적용되어 있다. 일반적으로 자바 프로그램은 main() 메소드에서 시작해서

개발자가 미리 정한 순서를 따라 객체가 생성되고 실행된다.

그런데 서블릿을 생각해보자. 서블릿을 개발해서 서버에 배포할 수는 있지만, 배포하고 나서는 개발자가

직접 제어할 수 있는 방법은 없다. 대신 서블릿에 대한 제어 권한을 가진 컨테이너가 적절한 시점에

서블릿 클래스의 객체를 만들고 그 안의 메소드를 호출한다.



이 방식은 대부분의 프레임워크에서 사용하는 방법으로,

개발자는 필요한 부분을 개발해서 끼워 넣기의 형태로 개발하고 실행하게 된다.

프레임워크가 이러한 구조를 가지기 때문에, **개발자는 프레임워크에 필요한 부품을 개발하고,**

**조립하는** **방식의 개발**을 하게 된다.

이렇게 조립된 코드의 **최종 호출은 개발자에 의해서 제어되는 것이 아니라,**

**프레임워크의 내부에서 결정된 대로** **이뤄지게 되는데**, 이러한 현상을 **"제어의 역전"**이라고 표현한다.



> 스프링은 그 자체가 "구조를 설계할 수 있도록 만들어졌다" 라는 뜻이다. 



![99A1C04D5C70D71432](https://user-images.githubusercontent.com/38201897/110720563-284d0f00-8252-11eb-968b-6015022197c6.png)

IoC가 아닌경우 - new 방식을 써서 객체가 필요할때마다 생성해야 한다.

IoC인경우 - new 방식을 써서 객체를 생성할 필요없다.

<br/>

### IoC 컨테이너

**컨테이너는 보통 인스턴스의 생명주기를 관리하며, 생성된 인스턴스들에게 추가적인 기능을 제공하도록하는 것이라 할 수 있다.**

 다시말해, 컨테이너란 작성한 코드의 처리과정을 위임받은 독립적인 존재라고 생각하면 된다. 컨테이너는 적절한 설정만 되어있다면 누구의 도움없이도 프로그래머가 작성한 코드를 스스로 참조한 뒤 알아서 객체의 생성과 소멸을 컨트롤해준다.

스프링 프레임워크도 **객체에 대한 생성 및 생명주기를 관리**할 수 있는 기능을 제공하고 있다. 즉, IoC 컨테이너 기능을 제공한다.

* IoC 컨테이너는 객체의 생성을 책임지고, 의존성을 관리한다.
* POJO의 생성, 초기화, 서비스, 소멸에 대한 권한을 가진다.
* 개발자들이 직접 POJO를 생성할 수 있지만 컨테이너에게 맡긴다.
* **빈(Bean)  :**  스프링이 제어권을 가지고 직접 만들고 관계를 부여하는 오브젝트
*  **빈 팩토리(Bean Factory)  :** 빈(오브젝트)의 생성과 관계 설정 제어를 담당하는 IoC오브젝트.
   좀 더 확장한 애플리케이션 컨텍스트(application context)를 주로 사용
* **애플리케이션 컨텍스트: (IoC 컨테이너 or 스프링 컨테이너)**
   DI를 위한 빈 팩토리에 엔터프라이즈 애플리케이션을 개발하는 데 필요한 여러 가지 컨테이너 기능을 추가한 것
* **설정정보/설정 메타정보** : 구성정보 or 형상정보 (XML)
* **스프링 컨테이너(IoC 컨테이너) :** IoC 방식으로 빈을 관리한다는 의미에서 애플리케이션 컨텍스트나 빈 팩토리를 의미

````
IoC컨테이너는 다른 용어로 빈 팩토리(Bean Factory), 애플리케이션 컨텍스트(Application Context) 라고도 불린다.스프링의 IoC 컨테이너는 일반적으로 애플리케이션 컨텍스트를 말한다.
 

* 빈 팩토리를 애플리케이션 컨텍스트 또는 IoC컨테이너라 말하기도 하지만, 사실 애플리케이션 컨텍스트는 빈을 좀 더 확장한 개념이다.
* 애플리케이션 컨텍스트는 그 자체로 IoC와 DI를 위한 빈 팩토리(Bean Factory)이면서 그 이상의 기능을 가진다.
* 빈팩토리와 어플리케이션컨텍스트는 각각 BeanFactory, ApplicationContext 두 개의 인터페이스로 정의한다.
* ApplicationContext 인터페이스는 BeanFactory 인터페이스를 상속한 서브인터페이스이다.
* 실제로 스프링 컨테이너 또는 IoC 컨테이너라고 말하는 것은 바로 이 ApplicationContext 인터페이스를 구현한 클래스의 오브젝트이다.
* 컨테이너가 본격적인 IoC 컨테이너로서 동작하려면 POJO클래스와 설정 메타정보가 필요하다.

(스프링 애플리케이션 : POJO 클래스와 설정 메타정보를 이용해 IoC 컨테이너가 만들어주는 오브젝트의 조합이다.)
````



<br/>

### IoC 컨테이너

 어떠한 객체의 명세서를 작성하고, 스프링 라이브러리는 해당 명세대로 객체를 생성. 생성된 객체(그리고 디펜던시)들을 보관하는 공간을 의미함

DL(Dependency Lookup) 과 DI(Dependency Injection)



* **DL** : 저장소에 저장되어 있는 Bean에 접근하기 위해 컨테이너가 제공하는 API를 이용하여 Bean을 Lookup 하는 것
* **DI :** 각 클래스간의 의존관계를 빈 설정(Bean Definition) 정보를 바탕으로 컨테이너가 자동으로 연결해주는 것
  * Setter Injection
  * Constructor Injection
  * Method Injection

DL 사용시 컨테이너 종속이 증가하여, 주로 DI를 사용함.

![99A9A0455C5A74AB20](https://user-images.githubusercontent.com/38201897/110720891-b75a2700-8252-11eb-9a02-fbf625d9107c.png)

<br/>

### IoC 용어 정리

- `bean` : **스프링에서 제어권을 가지고 직접 만들어 관계를 부여하는 오브젝트**
  Java Bean, EJB의 Bean과 비슷한 오브젝트 단위의 애플리케이션 컴포넌트이다. 하지만 스프링을 사용하는 애플리케이션에서 만들어지는 모든 오브젝트가 빈은 아니다. 스프링의 빈은 스프링 컨테이너가 생성하고 관계설정, 사용을 제어해주는 오브젝트를 말한다.
- `bean factory` : **스프링의 IoC를 담당하는 핵심 컨테이너**
  Bean을 등록/생성/조회/반환/관리 한다. 보통 bean factory를 바로 사용하지 않고 이를 확장한 application context를 이용한다. BeanFactory는 bean factory가 구현하는 interface이다. (getBean()등의 메서드가 정의되어 있다.)
- `application context` : **bean factory를 확장한 IoC 컨테이너**
  Bean의 등록/생성/조회/반환/관리 기능은 bean factory와 같지만, 추가적으로 spring의 각종 부가 서비스를 제공한다. ApplicationContext는 application context가 구현해야 하는 interface이며, BeanFactory를 상속한다.
- `configuration metadata` : **application context 혹은 bean factory가 IoC를 적용하기 위해 사용하는 메타정보**
  스프링의 설정정보는 컨테이너에 어떤 기능을 세팅하거나 조정하는 경우에도 사용하지만 주로 bean을 생성/구성하는 용도로 사용한다.
- `container (ioC container)` : **IoC 방식으로 bean을 관리한다는 의미에서 bean factory나 application context를 가리킨다.**
  application context는 그 자체로 ApplicationContext 인터페이스를 구현한 오브젝트를 말하기도 하는데, 하나의 애플리케이션에 보통 여러개의 ApplicationContext 객체가 만들어진다. 이를 통칭해서 spring container라고 부를 수 있다.

<br/>

## DI

<br/>

**DI란** **Dependency Injection**의 줄임말로 한글로 번역하면 **의존성 주입**이라는 말이다.

DI를 들어가기 전에, 의존성이라는 말부터 한번 보자

````
* 의사 코드

  운전자가 자동차를 생산한다.
  자동차는 내부적으로 타이어를 생산한다.

* Java 표현
  new Car();
  Car 객체 생성자에서 new Tire();

* 정말 간단히 의존성이란?

  의존성은 new 이다.
  new를 실행하는 Car와 Tire 사이에서 Car가 Tire에 의존한다라고 한다.
````

<br/>

**일체형**

 - Composition : HAS-A 관계
 - A가 B를 생성자에서 생성하는 관계 

![275F4C4254E6C6A20C](https://user-images.githubusercontent.com/38201897/110733002-8d136400-8268-11eb-8b14-7d6380afad5c.png)



"의존성 주입"은 제어의 역행이 일어날 때 스프링이 내부에 있는 **객체들간의 관계를 관리할 때 사용하는 기법**이다.

자바에서는 일반적으로 인터페이스를 이용해서 의존적인 객체의 관계를 최대한 유연하게 처리할 수 있도록 한다.

<br/>

**분리 / 도킹(부착) 형**

* Association 관계
* A객체가 다른 녀석이 만든 B 객체를 사용

![23213E4654E6C6DB2D](https://user-images.githubusercontent.com/38201897/110733179-dbc0fe00-8268-11eb-8e51-9f67feb2cf45.png)

````
그림 설명
A를 스마트폰, B를 배터리리라 하면,
일체형 스마트폰 (아이폰)은 바로 전원을 켜도 되지만,
배터리 탈부착 형태의 스마트폰 (갤럭시S)은 여기서는 배터리를 넣고, 전원을 넣어야 함.

일체형은 A라는 객체의 내부 프로세스에 대해 신경 쓸 필요가 없으며, 분리형은 A와 B를 개별적으로 세팅해 주어야 함. 단, 분리형은 내가 원하는 것(다른 배터리)으로 바꾸어 부착할 수 있음. 이것을 DI의 개념이라 보면 됨.
````

<br/>

의존성 주입은 말 그대로 **의존적인 객체를 직접 생성하거나 제어하는 것이 아니라,** 

**특정 객체에 필요한 객체를 외부에서 결정해서 연결**시키는 것을 의미한다.

즉, 우리는 클래스의 기능을 추상적으로 묶어둔 **인터페이스를 갖다 쓰면 되는 것**이다.

나머지는 스프링에서 객체를 주입해주기 때문이다.

따라서 이러한 의존성 주입으로 인해 **모듈 간의 결합도가 낮아지고** **유연성이 높아진다.**



* **Setter Injection** **(Setter 메서드를 이용한 의존성 삽입)** : 의존성을 입력 받는 setter 메서드를 만들고 이를 통해 의존성을 주입한다.
  <property name="myName" value="poodle"></property>
* **Constructor Injection (생성자를 이용한 의존성 삽입)** : 필요한 의존성을 포함하는 클래스의 생성자를 만들고 이를 통해 의존성을 주입한다.
  <constructor-arg ref="cat"></constructor-arg>
* **Method Injection (일반 메서드를 이용한 의존성 삽입)** : 의존성을 입력 받는 일반 메서드를 만들고 이를 통해 의존성을 주입한다.



다음 예제를 살펴보자. Player 객체에 있는 Weapon이라는 의존성 주입을 세터를 통해서 하고 있다. Gun으로 하든 Spike로 하든 무기를 바꿀 때 그 무기 객체를 생성하고 단순히 주입하기만 하면 된다.

````java
class Knife implements Weapon{

    public void useWeapon() {
        System.out.println("Use Knife");
    }
}

class Gun implements Weapon{

    public void useWeapon() {
        System.out.println("Use Gun");
    }
}

class Spike implements Weapon{

    public void useWeapon() {
        System.out.println("Use Spike");
    }
}

interface Weapon {

    void useWeapon();
}

public class Player {

    private Weapon weapon;

    Player(){
    }

    public void setWeapon(Weapon weapon) {
        this.weapon = weapon;
    }

    public void usePlayerWeapon() {
        weapon.useWeapon();
    }
}

public class Main {
    public static void main(String[] args) {
        /**
         * 의존성 주입을 통해 의존 요소들을 쉽게 갈아 끼울 수 있다.
         */
        Player player = new Player();

        player.setWeapon(new Gun());   // Player에 Gun 객체를 통한 의존성 주입
        player.usePlayerWeapon();

        player.setWeapon(new Spike()); // Player에 Spike 객체를 통한 의존성 주입
        player.usePlayerWeapon();

        player.setWeapon(new Knife()); // Player에 Knife 객체를 통한 의존성 주입
        player.usePlayerWeapon();
    }
}
````







**스프링에는 크게**
**(1)XML로 작성된 Bean 정의 파일을 이용한 DI**

**(2)어노테이션을 이용한 DI**

**(3)JavaConfig에 의한 DI가 있습니다. **

<br/>

(1-1) XML **config.xml**

객체의 생성과 도킹에 대한 내용이 소스 코드 상에 있는 것이 아닌 별도의 텍스트 파일(XML 설정 파일)에 분리하여 존재.
 (JAVA소스 컴파일 없이 XML 변경만으로 내용 변경 가능)

````
XML (스프링 DI) config.xml

<bean id=“record” class=“di.SprRecord”></bean> // 빈 객체 생성
<bean id=“view” class=“di.SprRecordView”> // 빈 객체 생성
  <property name=“record” ref=“record”></property> // setRecord() 호출 
</bean>

XML (스프링 DI) : 객체 생성 시, 패키지명을 포함한 풀 클래스 네임 작성.
XML에 작성된 명세서를 보고, IoC컨테이너가 각 객체를 생성하고, 값을 주입해줌.
여기서 ApplicationContext 가 IoC컨테이너 역할을 함.

JAVA
// XML을 파싱하여 컨테이너에 담는 작업
ApplicationContext ctx = new ClassPathXmlApplicationContext(“config.xml”);
RecordView = (RecordView) ctx.getBean(“view”);
````

<br/>

(1-2) XML(Bean) Sample

````
* 빈(Bean) 객체는 반드시 클래스를 사용. 인터페이스나 추상클래스는 객체 생성이 불가능함.
* 빈 객체 생성, 객체 초기화, 객체 값(또는 레퍼런스) 주입.

1)
<bean id=“record” name=“r1,r2 r3;r4” class=“di.SprRecord”>
    <property name=“kor” value=“20”></property>
</bean>

2)
<bean id=“record” name=“r1,r2 r3;r4” class=“di.SprRecord”>
    <constructor-arg value=“20”></constructor-arg>
</bean>

3)
<bean id=“record” name=“r1,r2 r3;r4” class=“di.SprRecord”>
    <constructor-arg name=“kor” value=“20”></constructor-arg>
</bean>

4)
<bean id=“record” ” name=“r1,r2 r3;r4” class=“di.SprRecord”
    p:kor=“50” p:eng=“60” p:math=“70”>

5)
<bean id=“view” class=”di.SprRecordView”>
    <property name=“record” ref=“record”></property>
</bean>
 

id : 빈 객체 고유 이름 (접근 가능자)
name : 객체의 이름(별칭)
class : 생성할 클래스
constructor-arg : 초기값 설정 (생성자 함수 사용)
property : 초기값 설정 (Setter함수 사용)

1) 이름이 record인 빈 객체 생성 / 별명 4개 : r1,r2,r3,r4 / SprReocrd 클래스 객체 생성.
   초기값으로 kor 라는 프로퍼티에 20값 대입 (set함수가 존재해야 위와 같은 프로퍼티 설정이 가능).
2) 이름이 record인 빈 객체 생성 / 생성자(인자가 하나인)를 통해서 값 대입 & 생성.
3) 생성자 중에서 kor 값을 입력받는 생성자를 통해서 20값 대입하고, 생성.
4) 3개의 인자를 받는 생성자를 통해 kor = 50, eng = 60, math = 70 대입 & 생성.
5) 생성된 record 객체를 set함수를 통해 프로퍼티에 저장하고 SprRecordView를 생성.

참고로 값을 대입하는 경우에는 value, 참조(레퍼런스)를 대입하는 경우에는 ref 를 사용.

````

<br/>

(2-1)어노테이션을 이용한 DI

<br/>

### @Autowired와 @Component

**인스턴스 변수 앞에 `@Autowired`를 붙이면 DI 컨테이너가 그 인스턴스 변수의 형에 대입할 수 있는 클래스를 `@Component`가 붙은 클래스 중에서 찾아내 그 인스턴스를 인젝션해줍니다(정확히는 Bean 정의에서 클래스를 스캔할 범위를 정해야 합니다).**
인스턴스 변수로의 인젝션은 접근 제어자가 private라도 인젝션 할 수 있으므로 Setter 메서드를 만들 필요는 없습니다. (과거에 캡슐화의 정보 은닉에 반하는 것이 아니냐는 논의가 있었지만, 현재는 편리함에 밀려 그런 논의를 보기 힘들어졌습니다.)

만약 @Component가 붙은 클래스가 여러 개 있어도 형이 다르면 @Autowired가 붙은 인스턴스 변수에 인젝션되지 않습니다. 이렇게 **형을 보고 인젝션하는 방법을 `byType`이라고 합니다.**



### @Autowired

@Autowired는 인스턴스 변수 앞에 붙이는 것 외에도, 다음과 같이 적당한 메서드 선언 앞에도 붙일 수 있습니다.

````java
@Autowired
public void setFoo(Foo foo) {
    this.foo = foo;
}
@Autowired
public void setFoo(Foo foo, Bar bar) {
    this.foo = foo;
    this.bar = bar;
}
````

또한 생성자에도 이용할 수 있습니다.

````java
public class Foo {
    @Autowired
    public Food(Bar b) {...}
}
````



