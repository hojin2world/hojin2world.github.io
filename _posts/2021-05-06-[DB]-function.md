---
layout: post
title:  "[DB] function"
categories: db
comments: true

---

### MySQL function을 이용해 직원 출석등록 함수 만들기

--------

#### 1.테이블 생성하기

````sql
CREATE TABLE `EMP_ATTEND` (
    `ATTEND_YMD` VARCHAR(8) NOT NULL COLLATE 'utf8_bin',
    `EMP_NO` VARCHAR(9) NOT NULL COLLATE 'utf8_bin'
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;
````

간단한 직원출석 테이블을 생성한다.

<br/>

#### 2.함수 생성하기

````sql
DELIMITER $$
 
DROP FUNCTION IF EXISTS FNC_ATTEND;
 
CREATE FUNCTION FNC_ATTEND(attendType VARCHAR(10), empNo VARCHAR(10)) RETURNS BOOL
// CREATE FUNCTION  "FUNCTION 명" (변수값1 타입 , 변수값2 타입) RETURN 타입

BEGIN
	 //DECLARE 변수명 varchar(50); 변수선언	 
     DECLARE exist_flag INT;
     DECLARE returnVal  BOOL;
         SET returnVal = FALSE;
 
     -- 출석 등록
     IF 'attend'= attendType THEN
         SELECT COUNT(1)
           INTO exist_flag // 조회한 컬럼값인 CODE_NAME 을 변수에 넣는다.
           FROM EMP_ATTEND
          WHERE EMP_NO = empNo 
            AND ATTEND_YMD = DATE_FORMAT(NOW(), '%Y%m%d')
         ;
         
         IF exist_flag = 0 THEN
             INSERT INTO EMP_ATTEND(
                      ATTEND_YMD
                    , EMP_NO
             )VALUES(
                   DATE_FORMAT(NOW(), '%Y%m%d')
                     , empNo 
             );
             SET returnVal = TRUE;
         END IF;
     END IF;
      RETURN returnVal;
END $$
 
DELIMITER ;
````

**function의 argument 2개를 지정해 생성하고 return 값은 boolean으로 받겠다.**



**만약 arg로 들어온 첫번째 값이  문자열 'attend' 일경우** 
**테이블에 해당 직원의 오늘날짜로 출석한 데이터가 있는지 확인하고**
**데이터가 없다면 오늘날짜와 직원번호로 값을 insert한다.**



**값이 insert 된 후 returnVal의 값은 TRUE가 된다.**

<br/>

#### 3.함수 호출하기

````sql
-- if return value 0 then false
-- else if return value 1 then true
 
SELECT FNC_ATTEND('attend', '1000');
````



**함수를 생성하고 위와 같이 호출을 해본다.**
**2개 파람값을 넣고 호출하면 1이나 0이 나오게 된다.**
**0이 나오면 false, 1이 나오면 true이다.**

<br/>

* 스토어드 함수는 프로시저와 달리 IN OUT 을 사용할수 없다.

* 스토어드 함수의 파라미터는 모두 입력 파라미터로 사용된다.

* 스토어드 함수는 RETURNS문으로 반환할 값의 데이터 형식을 지정하고, 본문 안에서는 RETURN 문으로 하나의 값을 반환 해야 한다. 스토어드 프로시저는 별도의 반환하는 구문이 없고 OUT 파라미터를 이용해서 값을 반환 할 수 있다.

* 스토어드 프로시저는 CALL 로 호출하지만 스토어드 함수는 SELECT 문장 안에서 호출된다.

* 스토어드 프로시저 안에는 SELECT 문을 사용할 수 있지만 , 스토어드 함수 안에서는 

  집합 결과를 반환하는 SELECT 를 사용할 수 없다.

* SELECT - INTO 는 집합 결과를 반환 하는 것이 아니므로 예외적으로  스토어드 함수에서
  사용할 수 있다. 

* 스토어드 프로시저는 여러 SQL문이나 숫자 계산 등의 다양한 용도로 사용되지만 스토어드 함수는 어떤 계산을 통해서 하나의 값을 반환 하는데 주로 사용된다.



<br/>

<br/>

<br/>

reference

출처: https://abc1211.tistory.com/136 [길위의 개발자]

