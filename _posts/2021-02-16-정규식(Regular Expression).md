---
layout: post
title:  "[java] 정규식"
categories: java
comments: true
---

# 정규식(Regular Expression) 

정규식이란 텍스트 데이터 중에서 원하는 조건(pattern)과 일치하는 문자열을 찾아 내기 위해 사용하는 것으로 미리 정의된 기호와 문자를 이용해서 작성한 문자열을 말한다.

원래 Unix에서 사용한던 것이고 Perl의 강력한 기능이었는데 요즘은 Java를 비롯해 다양한 언어에서 지원하고 있다.

정규식을 이용하면 많은 양의 텍스트 파일 중에서 원하는 데이터를 손쉽게 뽑아낼 수도 있고 입력된 데이터가 형식에 맞는지 체크할 수도 있다.예를들면 html문서에서 전화번호나 이메일 주소만을 따로 추출한다던가, 입력한 비밀번호가 숫자와 영문자의 조합으로 되어있는지 확인할 수 도 있다.



````+java
import java.util.regex.*;

class RegularEx1 {
	public static void main(String[] args){
		String[] date = {"bat","baby","bonus","date","cA"};
		
		Pattern p = Pattern.compile("c[a-z]*");
		
		for(int i=0; i < data.length; i++){
			Matcher m = p.matcher(data[i]);
			if(m.matches())
			 System.out.print(data[i]+",");
		}
	}
}
````



data라는 문자열배열에 담긴 문자열 중에서 지정한 정규식과 일치하는 문자열을 출력하는 예제이다.
Pattern은 정규식을 정의하는데 사용되고 Matcher는 정규식을 데이터와 비교하는 역할을 한다.
정규식을 정의하고 데이터를 비교하는 과정을 단계별로 설명하면 다음과 같다.

<br/>

* 정규식을 매개변수로 Pattern클래스의 static메서드인 Pattern Compile(String regex)을 호출하여 Pattern 인스턴스를 얻는다.

  Pattern p = Pattern.compile("c[a-z]*");

* 정규식으로 비교할 대상을 매개변수로 Pattern클래스의 Matcher matcher(CharSequence input)를 호출해서 Matcher인스턴스를 얻는다.

  Matcher m = p.matcher(data[i]);

* Matcher인스턴스에 boolean matches()를 호출해서 정규식에 부합하는지 확인한다.

  if(m.matches())

<br/>

**Pattern 클래스 주요 메서드**

compile(String regex) : 주어진 정규표현식으로부터 패턴을 만듭니다.
matcher(CharSequence input) : 대상 문자열이 패턴과 일치할 경우 true를 반환합니다.
asPredicate() : 문자열을 일치시키는 데 사용할 수있는 술어를 작성합니다.
pattern() : 컴파일된 정규표현식을 String 형태로 반환합니다.
split(CharSequence input) : 문자열을 주어진 인자값 CharSequence 패턴에 따라 분리합니다.

<br/>

**Parttern 플래그 값 사용(상수)**

Pattern.CANON_EQ : None표준화된 매칭 모드를 활성화합니다.
Pattern.CASE_INSENSITIVE : 대소문자를 구분하지 않습니다. 
Pattern.COMMENTS : 공백과 #으로 시작하는 주석이 무시됩니다. (라인의 끝까지).
Pattern.MULTILINE : 수식 ‘^’ 는 라인의 시작과, ‘$’ 는 라인의 끝과 match 됩니다.
Pattern.DOTALL : 수식 ‘.’과 모든 문자와 match 되고 ‘\n’ 도 match 에 포함됩니다.
Pattern.UNICODE_CASE : 유니코드를 기준으로 대소문자 구분 없이 match 시킵니다.
Pattert.UNIX_LINES : 수식 ‘.’ 과 ‘^’ 및 ‘$’의 match시에 한 라인의 끝을 의미하는 ‘\n’만 인식됩니다.

<br/>

**Matcher 클래스 주요 메서드**

matches() : 대상 문자열과 패턴이 일치할 경우 true 반환합니다.
find() : 대상 문자열과 패턴이 일치하는 경우 true를 반환하고, 그 위치로 이동합니다.
find(int start) : start위치 이후부터 매칭검색을 수행합니다.
start() : 매칭되는 문자열 시작위치 반환합니다.
start(int group) : 지정된 그룹이 매칭되는 시작위치 반환합니다.
end() : 매칭되는 문자열 끝 다음 문자위치 반환합니다.
end(int group) : 지정되 그룹이 매칭되는 끝 다음 문자위치 반환합니다.
group() : 매칭된 부분을 반환합니다.
group(int group) : 매칭된 부분중 group번 그룹핑 매칭부분 반환합니다. 
groupCount() : 패턴내 그룹핑한(괄호지정) 전체 갯수를 반환합니다.



---------------------



##### 자주사용하는 정규 표현식

| **정규 표현식**                            | **설명**     |
| ------------------------------------------ | ------------ |
| ^[0-9]*$                                   | 숫자         |
| ^[a-zA-Z]*$                                | 영문자       |
| ^[가-힣]*$                                 | 한글         |
| \\w+@\\w+\\.\\w+(\\.\\w+)?                 | E-Mail       |
| ^\d{2,3}-\d{3,4}-\d{4}$                    | 전화번호     |
| ^01(?:0\|1\|[6-9])-(?:\d{3}\|\d{4})-\d{4}$ | 휴대전화번호 |
| \d{6} \- [1-4]\d{6}                        | 주민등록번호 |
| ^\d{3}-\d{2}$                              | 우편번호     |

<br/>

##### 정규 표현식

| **정규 표현식** | **설명**                                                     |
| --------------- | :----------------------------------------------------------- |
| ^               | 문자열 시작                                                  |
| $               | 문자열 종료                                                  |
| .               | 임의의 한 문자(단 \은 넣을 수 없음)                          |
| *               | 앞 문자가 없을 수도 무한정 많을 수도 있음                    |
| +               | 앞 문자가 하나 이상                                          |
| ?               | 앞 문자가 없거나 하나 있음                                   |
| [ ]             | 문자의 집합이나 범위를 나타내며 두 문자 사이는 - 기호로 범위를 나타냅니다. [] 내에서 ^ 가 선행하여 존재하면 not을 나타낸다. |
| { }             | 횟수 또는 범위를 나타냅니다.                                 |
| ( )             | 소괄호 안의 문자를 하나의 문자로 인식                        |
| \|              | 패턴 안에서 or 연산을 수행할 때 사용                         |
| \               | 정규 표현식 역슬래시(\)는 확장문자 (역슬래시 다음에 일반 문자가 오면 특수문자로 취급하고 역슬래시 다음에 특수문자가 오면 그 문자 자체를 의미) |
| \b              | 단어의 경계                                                  |
| \B              | 단어가 아닌것에 대한 경계                                    |
| \A              | 입력의 시작 부분                                             |
| \G              | 이전 매치의 끝                                               |
| \Z              | 입력의 끝이지만 종결자가 있는 경우                           |
| \z              | 입력의 끝                                                    |
| \s              | 공백 문자                                                    |
| \S              | 공백 문자가 아닌 나머지 문자                                 |
| \w              | 알파벳이나 숫자                                              |
| \W              | 알파벳이나 숫자를 제외한 문자                                |
| \d              | 숫자 [0-9]와 동일                                            |
| \D              | 숫자를 제외한 모든 문자                                      |
| (?i)            | 앞 부분에 (?!)라는 옵션을 넣어주게 되면 대소문자는 구분하지 않습니다. |
