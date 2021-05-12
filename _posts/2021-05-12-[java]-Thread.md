---
layout: post
title:  "[java] Thread"
categories: java
comments: true

---

# Thread

#### 쓰레드의 개념 및 기본 예제

##### 프로세스와 쓰레드

**프로세스**

운영체제에서는 실행중인 하나의 어플리케이션을 프로세스라고 함.

운영체제로부터 실행에 필요한 메모리를 할당받아 어플리케이션의 코드를 실행.

 **쓰레드**

프로세스를 이루는 코드의 실행흐름.

하나의 쓰레드는 하나의 코드 실행흐름임.

 **멀티 프로세스**

서로 독립적. 하나의 프로세스에서 오류가 발생하더라도 다른 프로세스에 영향을 미치지 않음.

 **멀티 쓰레드**

하나의 프로세스 내부에 존재하기 때문에 하나의 쓰레드가 예외를 던지면 프로세스 하나가 아예 동작하지 않을 수 있음 -> 예외 처리 중요.

 **메인 쓰레드**

자바 어플리케이션은 메인쓰레드가 main 메소드를 실행하면서 시작함.

<br/>

#### 쓰레드의 생성

1. Thread 클래스로부터 직접 생성

```
Thread thread = new Thread(Runnable target);
```

\- 직접 생성하기 위해서는 Runnable 타입을 매개값으로 갖는 생성자를 호출해야함.

\- Runnable은 인터페이스 타입인데 run 메소드가 선언되어 있어 Runnable 구현객체는 run 메소드를 구현해야함.

\- Runnable 구현객체를 직접 Class로 정의해서 사용하거나 익명객체를 이용(주로 쓴다고 함.)하는 방법이 있음.

\- 코드를 실행하기 위해서는 run 메소드 호출이 아닌 start()를 호출해야함.

```
Runnable taskrun = new Task();
Thread thread = new Thread(taskrun);
Thread threadanony = new Thread( new Runnable(){
	public void run(){
    	//쓰레드가 실행할 코드흐름	
    }
});
```

2. Thread 하위 클래스로부터 생성.

\- Thread 클래스를 상속해야함.

```
import java.awt.Toolkit;

public class BeepThread extends Thread{
	@Override
	public void run() {
		Toolkit toolkit = Toolkit.getDefaultToolkit();
		for(int i =0; i<5; i++) {
			toolkit.beep();
			try {Thread.sleep(500);} catch(Exception e) {}
		}
	}
}
```

\- 0.5초마다 비프소리를 내는 쓰레드 하위 클래스 생성.

```
import java.awt.Toolkit;

public class BeepPrintExample3 {
	public static void main(String[] args) {
		Thread thread = new BeepThread();
		
		//2. ㅇ익명객체
		Thread thread2 = new Thread() {
			@Override
			public void run() {
				Toolkit toolkit = Toolkit.getDefaultToolkit();
				for(int i =0; i<5; i++) {
					toolkit.beep();
					try {Thread.sleep(500);} catch(Exception e) {}
				}
			}
		};
		
		
		thread2.start();
		
		for(int i =0; i<5; i++) {
			System.out.println("띵");
			try {Thread.sleep(500);} catch(Exception e) {}
		}
	}
}
```

\- 띵 출력과 띵 비프음이 거의 동시에 수행되는것처럼 결과가 나올 것.

<br/>

#### 쓰레드의 이름 정의

\- 쓰레드는 쓰레드마다 이름이 있음.

\- 큰 역할을 하지는 않지만 디버깅할때 어떤 쓰레드가 에러를 내는지 조사할 목적으로 사용된다고 함.

\- 이름을 주지 않은 쓰레드는 "Thread-n"이라는 이름으로 설정됨.

\- setName("쓰레드이름") 으로 쓰레드명을 설정가능.

\- getName() 메소드로 쓰레드 이름을 반환.

```
thread.setName("쓰레드명");
thread.getName(); // 쓰레드명 반환
```

\- currentThread()로 현재 코드를 실행하고 있는 쓰레드의 참조를 얻어올 수 있음

```
Thread thread = Thread.currentThread();
```

간단 예제

```
public class ThreadNameExample {
	public static void main(String[] args) {
		Thread mainThread = Thread.currentThread();
		System.out.println("프로그램 시작 쓰레드 이름: "+mainThread.getName());
		
		ThreadA threadA = new ThreadA();
		System.out.println("작업 쓰레드 이름 : "+threadA.getName());
		threadA.start();
		
		ThreadB threadB = new ThreadB();
		System.out.println("작업 쓰레드 이름 : "+threadB.getName());
		threadB.start();
		
	}
}
//-----------------------------------
public class ThreadA extends Thread{
	public ThreadA() {
		setName("ThreadA");
	}
	
	@Override
	public void run() {
		for(int i =0; i<2; i++) {
			System.out.println(getName()+"가 출력한 내용");
		}
	}
}
//-----------------------------------
public class ThreadB extends Thread{
	@Override
	public void run() {
		for(int i =0; i<2; i++) {
			System.out.println(getName()+"가 출력한 내용");
		}
	}
}
```

<br/>

### 쓰레드의 우선순위 개념

#### 쓰레드의 우선순위

동시성 : 멀티작업을 위해 하나의 코어에서 멀티 쓰레드가 **번갈아가면서 실행하는 성질**

병렬성 : 멀티작업을 위해 멀티 코어에서 개별 쓰레드를 **동시에 실행하는 성질**

 ![img1 daumcdn](https://user-images.githubusercontent.com/38201897/117932847-d866f300-b33b-11eb-968c-3e4217442230.png)

<br/>

#### 쓰레드 스케줄링

\- 쓰레드의 갯수가 코어의 수보다 많을 경우에 쓰레드를 어떤 순서에 의해 동시성으로 실행할 것인가에 대한 계획.

\- 아주 짧은 시간 쓰레드의 run 메소드를 번갈아가면서 실행한다.

 ##### 우선순위(priority)방식

\- 우선순위가 높은 쓰레드가 실행상태를 더 많이 가져감.

\- 객체에 우선순위를 부여하여 개발자가 제어가능.

\- 1부터 10까지 우선순위, 높으면 먼저 실행

```
thread.setPriority(우선순위);
```

우선순위 상수 : Thread.**MAX_PRIORITY**(10), Thread.**NORM_PRIORITY**(5), Thread.**MIN_PRIORITY**(1)

\- 우선순위가 높은 쓰레드가 실행기회를 더 많이 가지기 때문에 우선순위가 더 낮은 쓰레드보다 같은 작업이라도 빨리 끝낼 수 있다.

\- 하지만 쿼드 코어일 경우 쓰레드가 4개 보다 적을 경우는 우선순위가 크게 영향을 미치지 못한다. 5개이상일때 우선순위 방식이 효과를 보게 된다.

 

```
public class PriorityExample {
	public static void main(String[] args) {
		for(int i =1; i<=10; i++) {
			Thread thread = new ClacThread("thread"+i);
			if(i == 10) {
				//가장 낮은 우선순위
				thread.setPriority(Thread.MAX_PRIORITY);
			}else {
				//가장 높은 우선순위
				thread.setPriority(Thread.MIN_PRIORITY);
			}
			thread.start();
		}
	}
}
//---------------------------------------------------------
public class ClacThread extends Thread{
	public ClacThread(String name) {
		setName(name);
	}
	
	public void run() {
		for(int i =0; i<2000000000; i++) {}
		System.out.println(getName());
	}
}
```

##### 순환 할당(Round-robin) 방식

\- 시간할당량(Time Slice)을 정해 하나의 쓰레드를 정해진 시간만큼만 실행하도록 하는 방식.

\- JVM에 의해서 정해지기 때문에 코드로 제어 불가능

<br/>

### 쓰레드 동기화 메소드, 동기화 블럭

공유 객체 사용시

\- 싱글 쓰레드의 경우는 고민할 경우가 거의 없다.

\- 멀티 쓰레드의 경우 쓰레드간의 하나의 객체 공유 시 디버깅하기 어려운 오류가 나타날 수 있다.

![img1 daumcdn](https://user-images.githubusercontent.com/38201897/117933433-870b3380-b33c-11eb-822a-9054d197ac4c.png)

Tread-1이 공유객체의 멤버변수에 할당된 값을 변경. -> 그사이 Thread-2가 공유 객체의 멤버변수에 할당된 값을(null이 아닌지 모르고) 엎어침. -> Thread-1 공유객체 사용하려는데 값이바뀜-> 오류

이를 방지하기 위해 단 하나의 쓰레드만을 실행할 수 있는 임계영역을 지정해야 한다. 즉, 객체에 잠금을 걸어두어 하나의 쓰레드만이 접근가능하고 나머지 쓰레드는 대기하도록 만든다.

 

**키워드 : synchronized**

#### 동기화(synchronized) 메소드

````java
public synchronized void method(){
	//임계영역; 단하나의 쓰레드만 실행가능.
}
````



```java
package sync;

public class Calculator {
	private int memory;
	
	public int getMemory() {
		return memory;
	}
	//동기화 메소드로 선언하는 방법
	public synchronized void setMemory(int memory) { 
		this.memory = memory;
		try {
			Thread.sleep(2000);
		}catch(InterruptedException e) {}
		System.out.println(Thread.currentThread().getName()+" : "+this.memory);
	}
}
```

\- setMemory 메소드는 하나의 쓰레드만이 실행 가능한 메소드

#### 동기화(synchronized) 블럭

````java
public void method(){
	synchronized (공유객체){
    	//임계영역(단 하나의 쓰레드만 실행 가능)
    }
    //여러 쓰레드가 실행 가능한 영역.
}
````



```java
package sync;

public class Calculator {
	private int memory;
	
	public int getMemory() {
		return memory;
	}
	
	// 이렇게 동기화 블럭을 사용해서 처리할 수 있다.
	public void setMemory(int memory) {
		synchronized (this) {
			this.memory = memory;
			try {
				Thread.sleep(2000);
			}catch(InterruptedException e) {}
			System.out.println(Thread.currentThread().getName()+" : "+this.memory);
		}
	}
}
```

<br/>

### 쓰레드의 상태제어 메소드 및 데몬 쓰레드 개념 

#### 쓰레드의 상태제어

\- 실행중인 쓰레드의 상태를 변경하는 것.

\- 메소드로 주로 제어

\- interrupt(), sleep(), join(), wait(), yield() notify(), notifyAll() 등의 메소드가 존재.

\- 이중 notify(), notifyAll(), wait() 메소드는 Object 클래스의 메소드이고 나머지는 Thread 클래스의 메소드.

#### 일정시간동안 일시정지 : sleep()

\- 실행중인 쓰레드를 일시정지.

\- 매개값으로 밀리초를 넣어주면 해당 시간동안 sleep() 메소드를 만나는 쓰레드는 일시정지함.

\- 일시정지 상태에서 interrupt() 메소드를 호출할 경우 InterruptedException이 발생됨.

```java
try{
	Thread.sleep(1000); //1초간 일시정지(밀리초 : 1000 -> 1초)
}catch(InterruptedException){
	//interrupt() 메소드가 호출되면 실행.
}
```

#### 타 쓰레드에 실행 양보 : yield()

\- 쓰레드가 처리하는 반복작업을 위해 for문이나 while문을 사용하는 경우가 많음.

```java
public void run(){
	while(true){
    	if(work){
        	System.out.println("ThreadA 작업 내용");
        }
    }
}
```

-이때 while문은 boolean 타입 work 변수가 false 일경우에는 쓸데없는 루프를 돌게됨.

\- yield() 메소드를 호출하면 호출한 쓰레드는 실행대기상태로 돌아가고 동일한 우선순위 혹은 높은 우선순위를 갖는 다른 쓰레드가 실행 기회를 갖게됨.

```java
public class ThreadA extends Thread{
	public boolean stop = false; //종료 플래그
	public boolean work = true; // 작업진행여부
	
	public void run() {
		while(!stop) {
			if(work) {
				System.out.println("ThreadA 작업 내용");
			}else {
				Thread.yield();
			}
		}
		System.out.println("ThreadA 종료");
	}
}
```

\- ThreadA가 else 문으로 yield 메소드를 만나면 현재 Thread 객체인 ThreadA의 run 메소드는 실행대기 상태가 되고 ThreadB가 실행기회를 갖는다.

#### 다른 쓰레드의 종료를 기다림 : join()

\- 다른 쓰레드가 종료되어야 실행해야하는 쓰레드가 존재

\- 계산작업이 그 예인데, 계산하여 결과를 return 하는 쓰레드가 존재하면 그것을 출력하는 쓰레드가 필요한데

\- 그 때 출력쓰레드가 먼저 수행되면 오류임.

```java
public class SumThread extends Thread{
	private long sum;

	public long getSum() {
		return sum;
	}

	public void setSum(long sum) {
		this.sum = sum;
	}

	public void run() {
		for(int i =1; i<=100; i++) {
			sum+=i;
		}
	}
	
	@Override
	public String toString() {
		return "SumThread [sum=" + sum + "]";
	}
}

public class JoinExample {
	public static void main(String[] args) {
		SumThread sumThread = new SumThread();
		sumThread.start();
		
		try {
			sumThread.join();//현재 쓰레드 기준 (이부분을 주석처리해서 결과를 비교해보세요)
		} catch (Exception e) {
		}
		System.out.println("1~100 합 : "+sumThread.getSum());
	}
}
```

\- 여기서 출력쓰레드는 메인쓰레드가 담당한 것임.

#### 쓰레드간 협력 : wait() , notify() , notifyAll()

\- 두개의 쓰레드를 번갈아가면서 실행

\- 핵심은 공유객체의 활용

\- 두 쓰레드가 작업할 내용을 동기화 메소드로 구분.

\- 쓰레드1 작업 완료 -> notify() 메소드 호출 -> (일시정지)쓰레드 2 실행대기상태로 변경 -> 쓰레드 1은 wait() (일시정지 상태)

\- 이들 메소드는 동기화 메소드 혹은 동기화 블록에서만 사용가능.

```java
//공유객체
public class WorkObject {
	public synchronized void methodA() {
		System.out.println("ThreadA의 methodA() 작업 실행");
		notify(); //일시정지 상태에 있는 ThreadB를 실행대기 상태로 만듬.
		try {
			wait();//ThreadA를 일시정지 상태로 만듬.
		} catch (Exception e) {
		}
	}
	
	public synchronized void methodB() {
		System.out.println("ThreadB의 methodB() 작업 실행");
		notify(); //일시정지 상태에 있는 ThreadA를 실행대기 상태로 만듬.
		try {
			wait();//ThreadB를 일시정지 상태로 만듬.
		} catch (Exception e) {
		}
	}
}

//Thread A
public class ThreadA extends Thread{
	private WorkObject workObject;
	
	public ThreadA(WorkObject workObject) {
		this.workObject = workObject;
	}
	
	@Override
	public void run() {
		for(int i =0; i<10; i++) {
			workObject.methodA();
		}
	}
}

//ThreadB
public class ThreadB extends Thread{
	private WorkObject workObject;
	
	public ThreadB(WorkObject workObject) {
		this.workObject = workObject;
	}
	
	@Override
	public void run() {
		for(int i =0; i<10; i++) {
			workObject.methodB();
		}
	}
}

//main 쓰레드
public class WaitNotifyExample {
	public static void main(String[] args) {
		WorkObject shareObject = new WorkObject(); //공유객체 생성
		
		ThreadA threadA = new ThreadA(shareObject);
		ThreadB threadB = new ThreadB(shareObject);//ThreadA와 ThreadB 생성
		
		threadA.start();
		threadB.start();
				
	}
}
```

\- 메인 쓰레드에서 공유객체를 생성

\- 각각의 쓰레드의 멤버변수로 초기화. 공유 객체의 methodA와 methodB를 사용

\- methodA와 methodB는 번갈아가면서 실행되어야함.

\- 이 협력개념에서 발전하여 유명한 자바 디자인 패턴인 생산자 소비자 패턴으로 연결됨.

#### 쓰레드의 안전종료 : interrupt()

\- run() 메소드가 모두 실행되면 쓰레드는 종료됨.

\- 기존의 stop() 이란 메소드가 제공되었으나 deprecated 되었다. -> 문제

\- 왜? -> 쓰레드가 사용하던 자원이 문제가 될 가능성( 자원이란 파일, 네트워크 연결 등)

\- interrupt() 메소드를 이용하여 자원도 해제하며 안전하게 종료할 수 있음.

 

```java
public class PrintThread2 extends Thread{
	public void run() {
		try {
			while(true) {
				System.out.println("실행 중");
				Thread.sleep(1);
				//if(Thread.interrupted()) {
				//if(Thread.currentThread().isInterrupted()) {
					//break;
				//}
			}
		} catch (InterruptedException e) {
			System.out.println("interrupt() 실행");
		}
		System.out.println("자원 정리");
		System.out.println("실행 종료");
	}
}

//메인 쓰레드
public class InterruptExample {
	public static void main(String[] args) {
		Thread thread = new PrintThread2();
		thread.start();
		
		try {
			Thread.sleep(1000);
		} catch (Exception e) {
			
		}
		thread.interrupt();
	}
}
```

\- 메인쓰레드에서 interrupt() 메소드가 호출할 때 PrintThread2 쓰레드는 InterruptedException이 발생하기 위해서는 일시정지상태에 있어야 한다. 그렇지 않으면 아무의미가 없다.

 

\- 그래서 Thread.sleep(1) 코드로 한번 일시정지 상태를 만들어주고 메인쓰레드에서 interrupt() 메소드를 실행하고 먼저 종료하였기 때문에 이후 PrintThread2 쓰레드는 자원을 정리하는 코드를 실행하며 안전하게 종료하게 된다.

\- 주석처리된 Thread.interrupted() 메소드와 isInterrupted() 메소드는 모두 interrupt() 메소드가 실행됬는지 여부를 반환하는 boolean 값이다. 참조객체를 보면알겠지만 Thread.interrupted()는 static 메소드이고, isInterrupted() 메소드는 인스턴스 메소드이다. 둘중 어떤것을 사용해도 좋다.

#### 데몬 쓰레드

\- 쓰레드의 작업을 돕는 보조적인 역할을 수행하는 쓰레드.

\- 주 쓰레드가 종료되면 데몬쓰레드는 강제적으로 자동 종료.

\- Java의 Garbage Collector가 대표적인 데몬 쓰레드라고 함. - > JVM이 종료되면 같이 종료되니까.

\- 현재 쓰레드에서 다른 쓰레드를 데몬쓰레드로 만들기 위해서는 데몬 쓰레드가될 쓰레드의 참조객체에서 setDaemon(true)를 호출해주면 된다.

\- **주의점**은 데몬쓰레드의 쓰레드가 이미 start() 메소드를 호출한 상태라면 IllegalThreadStateException이 발생하기 때문에 start() 메소드를 호출하기 존에 setDaemon(true)를 실행해야한다.

 

```java
public class AutoSaveThread extends Thread{
	public void save() {
		System.out.println("작업 내용을 저장함");
	}
	
	@Override
	public void run() {
		while(true) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				System.out.println("1");//여기실행안됨. exception 발생은 아님
				e.printStackTrace();
				break;
			}
			save();
		}
	}
}

//메인 쓰레드
public class DaemonExample {
	public static void main(String[] args) {
		AutoSaveThread autoSaveThread = new AutoSaveThread();
		autoSaveThread.setDaemon(true);
		autoSaveThread.start();
		
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {

		}
		System.out.println("메인 쓰레드 종료");
	}
}
```

\- 코드를 실행해보면 기존의 쓰레드는 메인 쓰레드가 죽어도 반복작업을 하는 경우는 작업쓰레드는 살아있어 프로그램이 죽지 않았는데 위 예제는 메인 쓰레드가 죽으면서 데몬쓰레드도 같이 죽어서 프로그램을 종료시킨다.

<br/>

### 쓰레드 그룹 개념 

#### Thread Group

\- 관련된 쓰레드를 묶어서 관리할 목적으로 사용.

\- JVM이 실행될때
\- system 쓰레드 그룹을 만듬 
\- JVM 운영에 필요한 쓰레드들을 생성
\- system 쓰레드 그룹에 포함시킴

#### 쓰레드 그룹 이름 얻기

````java
ThreadGroup group = Thread.currentThread().getThreadGroup();
String groupName = group.getName();
````

#### 쓰레드 그룹 예제

```java
public static void main(String[] args) {
	ThreadGroup group = Thread.currentThread().getThreadGroup();
	//System.out.println(group.getName());
		
	AutoSaveThread autoSaveThread = new AutoSaveThread();
	autoSaveThread.setName("AutoSaveThread");
	autoSaveThread.setDaemon(true);
	autoSaveThread.start();
		
	Map<Thread, StackTraceElement[]> map = Thread.getAllStackTraces();
	Set<Thread> threads = map.keySet();
		
	for(Thread thread : threads) {
		System.out.println("Name : "+thread.getName() + ((thread.isDaemon()) ? "(데몬)":"(주)"));
		System.out.println("\t"+"소속그룹 : "+thread.getThreadGroup().getName());
		System.out.println();
	}
}
```

\- getAllStackTraces() : 프로세스 내에서 실행하는 모든 쓰레드에 대한 정보를 얻음.

#### 결과

````
Name : Signal Dispatcher(데몬)  
소속그룹 : system  
Name : AutoSaveThread(데몬)  
소속그룹 : main  
Name : main(주)  
소속그룹 : main  
Name : Attach Listener(데몬)  
소속그룹 : system  
Name : Finalizer(데몬) - 가비지 컬렉터 담당.  
소속그룹 : system  
Name : Reference Handler(데몬)  
소속그룹 : system
````

작업쓰레드는 대부분 메인쓰레드에서 생성한다. 쓰레드의 그룹을 직접 정해주지 않으면 디폴드로 현재 쓰레드의 그룹에 속하게 된다. 따라서 AutoSaveThread는 메인쓰레드에서 생성하였으므로 메인쓰레드의 그룹에 속하는 main그룹에 속하였다.

#### ThreadGroup 클래스가 가지고 있는 주요 메소드

|             | 메소드                    | 설명                                                         |
| ----------- | ------------------------- | ------------------------------------------------------------ |
| int         | activeCount()             | 현재 그룹 및 하위 그룹에서 활동중인 모든 쓰레드의 수를 리턴한다. |
| int         | activeGroupCount()        | 현재 그룹에서 활동 중인 모든 하위 그룹의 수를 리턴한다       |
| void        | checkAccess()             | 현재 쓰레드가 쓰레드 그룹을 변경할 권한이 있는지 체크한다. 만약 권한이 없으면 SecurityException을 발생시킨다 |
| void        | destroy()                 | 현재 그룹 및 하위 그룹을 모두 삭제한다. 단, 그룹 내에 포함된 모든 쓰레드들이 종료 상태가 되어야 한다. |
| boolean     | isDestroyed()             | 현재 그룹이 삭제되었는지 여부를 리턴한다                     |
| int         | getMaxPriority()          | 현재 그룹에 포함된 쓰레드가 가질 수 있는 최대 우선순위를 리턴한다 |
| void        | setMaxPriority(int pri)   | 현재 그룹에 포함된 쓰레드가 가질 수 있는 최대 우선순위를 설정한다 |
| String      | getName()                 | 현재 쓰레드 그룹의 이름을 리턴한다.                          |
| ThreadGroup | getParent()               | 현재 쓰레드 그룹의 부모그룹을 리턴한다.                      |
| boolean     | parentOf(ThreadGroup g)   | 현재 그룹이 매개값으로 지정한 쓰레드 그룹의 부모인지 여부를 리턴한다. |
| void        | setDaemon(boolean daemon) | 현재 그룹을 데몬그룹으로 설정한다.                           |
| void        | list()                    | 현재 그룹에 포함된 쓰레드와 하위 그룹에 대한 정보를 출력한다. |
| void        | interrupt()               | 현재 그룹에 포함된 모든 쓰레드들을 interrupt한다.            |

 

#### 쓰레드 그룹의 일괄적으로 interrupit() 호출

쓰레드 그룹을 사용하는 이점

\- 그룹내 포함된 모든 쓰레드들을 일괄 interrupt() 시켜서 안전하게 종료할 수 있다. 여러번 할걸 한번에 가능하다는 것.
\- 하지만 쓰레드 그룹의 interrupt() 메소드는 소속된 쓰레드의 interrupt() 메소드를 실행만 할뿐 개별 쓰레드의 InterruptedException 예외처리는 하지 않는다.

\- 개별 쓰레드에서 InterruptedException 처리를 해주어야 한다.

 

\- 예제

```
public class WorkThread extends Thread{
	public WorkThread(ThreadGroup threadGroup, String threadName) {
		super(threadGroup, threadName);
	}
	
	@Override
	public void run() {
		while(true) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				System.out.println(getName()+" interrupted");
				break;
			}
		}
		System.out.println(getName()+ " 종료됨");
	}
}

public class Main{
	public static void main(String[] args) {
		ThreadGroup myGroup = new ThreadGroup("myGroup");
		WorkThread workThreadA = new WorkThread(myGroup, "workThreadA");
		WorkThread workThreadB = new WorkThread(myGroup, "workThreadB");
		
		workThreadA.start();
		workThreadB.start();
		
		System.out.println("[main 쓰레드 그룹의 list() 메소드 출력 내용]");
		ThreadGroup mainGroup = Thread.currentThread().getThreadGroup(); //현재쓰레드의 그룹
		mainGroup.list();
		
		System.out.println();
		
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {}
		
		System.out.println("[myGroup 쓰레드 그룹의 interrupted() 메소드 호출]");
		myGroup.interrupt();
	}
}
```

\- WorkThread 클래스를 보면 catch문으로 interrupt 예외처리를 해준 모습이다. while문을 돌면서 예외를 발생시키면 탈출한다.

\- list 메소드는 현재 그룹의 이름과 최대 우선순위를 헤더로 출력하고 그아래 쓰레드 그룹에 포함된 쓰레드와 하위 쓰레드 그룹의 내용을 보여준다.

\- 맨 아래쪽의 myGroup.interrupt() 메소드는 쓰레드 그룹에 포함된 모든 쓰레드에 interrupt() 메소드를 호출한다.

\- 실행결과를 보면 메인쓰레드가 종료한 뒤 두개의 WorkThread 객체 쓰레드가 종료하는 것을 볼 수 있다.

````
[main 쓰레드 그룹의 list() 메소드 출력 내용]
java.lang.ThreadGroup[name=main,maxpri=10]
    Thread[main,5,main]
    java.lang.ThreadGroup[name=myGroup,maxpri=10]
        Thread[workThreadA,5,myGroup]
        Thread[workThreadB,5,myGroup]

[myGroup 쓰레드 그룹의 interrupted() 메소드 호출]
workThreadA interrupted
workThreadA 종료됨
workThreadB interrupted
workThreadB 종료됨
````

<br/>

### 쓰레드 풀 예제 , 개념 (Future 객체, execute(), submit())

##### 쓰레드풀

\- 병렬작업 처리가 많아지면 쓰레드 개수 증가 -> 쓰레드 생성 및 스케쥴링을 CPU가 바빠져서 메모리 많이 사용

\- 결국 성능저하.

\- 갑작스런 병렬 작업처리가 많아질 때 쓰레드풀을 이용.

\- 쓰레드를 제한된 개수만큼 정해놓고 **작업큐**(Queue)에 들어오는 작업들을 하나씩 쓰레드가 맡아서 처리.

\- 쓰레드풀 생성/사용을 위해 Executors 클래스와 ExecutorService 인터페이스를 제공.

\- Executors의 다양한 정적메소드로 ExecutorService의 구현객체를 만들 수 있는데 이것이 바로 쓰레드풀.

##### 쓰레드풀 생성

Executors 클래스

\- newCachedThreadPool()

\- newFixedThreadPool()

```java
ExecutorService executorService = Executors.newCachedThreadPool();

ExecutorService executorService2 = Executors.newFixedThreadPool(
	Runtime.getRuntime().availableProcessors();
); //cpu의 코어수만큼 최대쓰레드풀 생성
```

##### 쓰레드풀 종료

executorService.shutdown() - 남아있는 작업을 마무리하고 쓰레드풀 종료

executorService.shutdownNow() - 남아있는 작업과는 상관없이 강제로 종료

#### 작업생성과 처리요청

##### 작업생성

\- 하나의 작업은 Runnable or Callable 구현 클래스로 표현한다.

\- Runnable(무)과 Callable(유)의 차이는 리턴값의 유무이다.

```java
Runnable task = new Runnable(){
	@Override
    public void run(){ /*쓰레드가 처리할 작업 내용*/ }
}

Callable<T> taskc = new Callable<T>(){
	@Override
    public T call() throws Exception{
    	//쓰레드가 처리할 작업 내용
		return T;
    }
}
```

##### 작업처리요청

\- ExecutorService의 작업큐에 Runnable 혹은 Callable객체를 넣는 행위

\- 작업처리 요청을 위해 submit()과 execute() 메소드를 제공함.

\- execute() : Runnable을 작업큐에 저장

\- submit() : Runnable 또는 Callable을 작업큐에 저장, Future 객체를 리턴

\- submit 메소드를 사용하는 것이 쓰레드의 생성오버헤드를 줄이는데 좋다. 왜냐하면 execute메소드는 작업처리중 예외가 발생하면 쓰던 쓰레드를 버리고 새로운 쓰레드를 생성한다. 하지만 submit 메소드는 쓰던 쓰레드를 재활용한다.

(이는 쓰레드이름을 통해 확인할 수 있다.)

```
public static void main(String[] args) throws Exception{
		ExecutorService executorService = Executors.newFixedThreadPool(2); //최대쓰레드 개수가 2인 쓰레드풀 생성
		
		for(int i =0; i<10; i++) {
			Runnable runnable = new Runnable() {

				@Override
				public void run() {
					ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) executorService;
					int poolSize = threadPoolExecutor.getPoolSize();
					String threadName = Thread.currentThread().getName();
					System.out.println("[총 쓰레드 개수 : "+poolSize+"] 작업 쓰레드 이름 :"+threadName);
					
					//예외 발생시킴
					int value = Integer.parseInt("삼");
				}
			};	
            //이 두개를 번갈아가면서 실행해보세요.
			//executorService.execute(runnable);
			executorService.submit(runnable);
			
			Thread.sleep(10);//콘솔 출력시간을 위해 0.01초 일시정지
		}
		executorService.shutdown();
	}
```

