---
layout: post
title:  "[DB] ORACLE - JOIN 정리"
categories: db
comments: true



---

# ORACLE

--------------

<br/>

![1_jAt5tID0Kc9B-8AGbeBivw](https://user-images.githubusercontent.com/38201897/110049989-46b89380-7d96-11eb-9291-1e4e041fe35d.png)

<br/>

## JOIN

<br/>

- 2개 이상의 테이블에서 데이터를 검색하기 위해서 사용
- FROM 절에 두 개 이상의 테이블을 명시한다(View, Subquery도 가능)
- 공통된 컬럼이 없다면, 두 테이블의 공통컬럼을 가진 다른 테이블과 JOIN한 후 목표 테이블과 JOIN
- 두 테이블의 모든 조합 확인

```
SELECT * FROM 테이블1, 테이블2;
```

- 만약 테이블1, 테이블 2에 각 각 3개의 정보가 있다면 모든 데이터를 조합하므로 총 9개의 데이터가 나옴
- 조건을 걸어서 데이터에 알맞은 값을 매칭 시켜줘야 함

<br/>

### SELF JOIN

- 자기 자신의 테이블과 합치는 것
- 찾고자 하는 값이 자신의 테이블에 있을 때 사용

```
SELECT a.칼럼명, b.칼럼명 ...
FROM 테이블1 A JOIN 테이블1 B
ON A.컬럼 = B.다른컬럼 
```

<br/>

### INNER JOIN 사용법

- 조건에 부합하는 두 테이블의 데이터를 합치는 방식
- 컬럼 사용 시 테이블 구분이 필요

```
SELECT a컬럼명, b.컬럼명 etc... FROM TABLE_NAME  a, TABLE_NAME b
WHERE a.조건컬럼 == b.조건컬럼 (그외 조건이 있다면 추가)
```

- INNER JOIN ANSI JOIN
- WHERE절에 조건이 길어지만 AND가 많이 늘어남
- 결과는 같은데 표기법이 다름

```
SELECT a.칼럼명, b.칼럼명 ...
FROM 테이블1 A JOIN테이블2 B
ON 조건
```

- 3개 이상의 테이블 JOIN

```
SELECT a.칼럼명, b.칼럼명 ...
FROM 테이블1 A, 테이블2 B
ON 조건
JOIN 테이블3
ON 조건
```

<br/>

### FULL OUTER JOIN

* 두 테이블에 합집합이라고 생각하면 된다
* 공통된 값들은 공통된 값끼리 묶어져서 나오고, 공통되지 않은 값들도 모두 다 출력됨

````
SELECT * FROM TABLEA
FROM OUTER JOIN TABLEB
ON TABLEA.칼럼명 = TABLEB.칼럼명
````

<br/>

### OUTER JOIN

- INNER JOIN 사용시 테이블 데이터가 매칭되지 않은 정보는 볼 수 없음
- 데이터가 매칭 되지 않더라도 한쪽의 테이블을 전부 보고 싶을 때 OUTER JOIN을 사용함
- 매칭되는 데이터가 없을 때 NULL이 표시
- (OUTER JOIN 연산자) + 표시는 전체를 보고 싶은쪽 반대편에 붙이도록 함

```
SELECT A.칼럼, B.칼럼 ..
FROM TALBLE1 A, TABLE2 B
WHERE A.칼럼 = B.칼럼(+)
```

- OUTER JOIN ANSI JOIN
- 전체 데이터를 보고 싶은 쪽을 JOIN에 지정
- 왼쪽 테이블의 데이터를 전체 출력하고 싶다면 LEFT JOIN, 오른쪽일 경우 RIGHT JOIN

```
SELECT TABLE1 A, TABLE2 B
FROM TABLE1 A LEFT JOIN TABLE2 B
ON A.칼럼 = B.칼럼
```

<br/>

### LEFT OUTER JOIN

* 두 테이블 중에서 오른쪽 테이블에 조인시킬 컬럼의 값이 없는 경우에 사용한다
* 왼쪽 테이블(TABLE A)의 값은 모두 나오지만 오른쪽 테이블 (TABLE B)의 값은 매칭되는게 없으면 
  출력되지않음

````
SELECT * FROM TABLEA
LEFT OUTER JOIN TABLEB
ON TABLEA.칼럼 = TABLEB.칼럼
````

<br/>

### RIGHT OUTER JOIN

* 두 테이블 중에서 오른쪽 테이블에 조인시킬 컬럼의 값이 없는 경우에 사용하게 된다
* 오른쪽 테이블 (TABLE B)의 값은 모두 다 나오지만 왼쪽 테이블 (TABLE A)의 값은 매칭되는게 없으면 
  출력되지 않음

````
SELECT * FROM TABLEB
RIGHT OUTER JOIN TABLEA
ON TABLEB.칼럼 = TABLEA.칼럼
````

<br/>

### SUB QUERY

- 예를들어 ‘평균 연봉보다 많은 사람만 출력하시오’란 예제가 있다면 먼저 평균연봉을 구해야한다
- 이 때 평균연봉을 구한 후 결과를 복사해서 비교하면 2번 실행해야하므로 비효율적이다
- SUB QUERY를 사용해서 결과값을 구한 후 메인쿼리에서 사용할 수 있다
- 서브쿼리를 먼저 작성 후 메인쿼리를 작성한다

```
SELECT TABLE1 칼럼
FROM TABLE1
WHERE 연봉 > (SELECT AVG(연봉) FROM TABLE1)
```