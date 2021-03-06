# Kofax RPA

##### [Description]

Kofax RPA는 애플리케이션 통합과 로봇 프로세스 자동화 (RPA)를 위한 플랫폼입니다.

이 플랫폼을 통해 클라우드/SaaS 애플리케이션과 프메미스 시스템, 레거시 시스템과 최신 웹 애플리케이션 , 백 오피스 시스템과 파트너 웹 사이트 등 당초 연결되도록 설계되지 않은 애플리케이션을 서로 통합하고 이종 시스템 간 프로세스를 자동화 할 수 있습니다.



Visual Editor [Design Studio]를 이용해 통합하고자 하는 애플리케이션과 데이터 소스를 클릭하면 자동 으로 워크플로우가 생성됩니다.

* Design Studio 로봇을 쓰고 디버깅하는 Kofax RPA 애플리케이션
* 로봇용 통합개발 환경(IDE) 입니다.



Kofax RPA에서는 이러한 워크플로를 로봇이라고 합니다. 로봇을 만들면 애플리케이션을 통합하는 동안 자유롭게 탐색할 수 있습니다. 애플리케이션에 로그인할 수도 있고 페이지의 데이터 부분을 추출할 수도 있으며 데이터를 폼이나 검색창에 입력할 수도 있습니다. 또한 메뉴를 선택하고 여러 페이지를 스크롤 할 수도 있습니다. 로봇은 또 데이터베이스와 파일, API , 웹 서비스에 엑세스하여 한 애플리케이션에서 다른 애플리케이션으로 데이터를 보낼 수 있고, 그 과정에서 필요하다면 데이터를 반환할 수 도있습니다.



사용자는 Kofax RPA의 Desktop Automation을 통해 Windows와 Java 애플리케이션을 네트워크 컴퓨터에서 자동화 할 수 있습니다. Desktop Automation은 데스크톱이나 단말기에 있는 애플리케이션을 제어하여 수동 프로세스를 대체하는 역할을 합니다. 



로봇은 만들어지고 나면 Management Console(ServerIp : port)에 있는 저장소로 업로드 됩니다.여기서 RoboServer에서의 배치-실행으로 예약하거나 Java와 C# API 또는 맞춤형 REST 서비스를 통해 요청 시 실행할 수 있습니다. REST 서비스는 로봇이 저장소에 추가되거나 Kapplet이라고 하는 특수 목적을 사용자 웹 애플리케이션으로 노출되면 즉시 이용가능합니다.



Managemet Console은 부하 균형유지, 페일오버 , RoboServer 건전성 모니터링 , 사용자 역할과 허가 관리도 담당합니다.



--------------



Automation Device Mapping

Cluster Name : - 
Mapping Name : -

Management Console -> DeviceMapping
+New Device Mapping

Mapping = Labels(-)      Mapping Name = Label Name

CreateRobor  -> Action Step (Desktop Automation) Properties Action Require Devices (static, Device name mapping)



Host Name -> DA IP address
MCPATH -> Server IP : Port

내장 브라우저가 잘 동작하지 않는 경우 -> DA 사용





----------------

![image-20210201163901399](https://user-images.githubusercontent.com/38201897/106436156-1f308b80-64b7-11eb-85c8-b10faaca95b5.png)각 각의 동작을 처리할 로봇 생성.

![image-20210201163901399](https://user-images.githubusercontent.com/38201897/106436159-1fc92200-64b7-11eb-829d-fbc9356d90f9.png)

type - > Java의 DTO랑 사용법이 비슷하다. 

![image-20210201163913020](https://user-images.githubusercontent.com/38201897/106436160-1fc92200-64b7-11eb-8621-0e6133a812f8.png) 

type 안에는 변수를 get,set 할 수 있는 기능이 있다고 보면 이해하기 쉽다. ex ) DTO





###### 0_ExcelStore_v1.0.robot

![image-20210201163539083](https://user-images.githubusercontent.com/38201897/106436146-1dff5e80-64b7-11eb-9c27-ce7b2872d32f.png)

![image-20210201163612099](https://user-images.githubusercontent.com/38201897/106436151-1e97f500-64b7-11eb-89ec-7d7605cd6b9d.png)

![image-20210201163624204](https://user-images.githubusercontent.com/38201897/106436155-1f308b80-64b7-11eb-8d96-4d65f6e9386e.png)

날짜 변수 설정 Variables의 변수 명을 생성해 준 후 value값을 선택 
value - > converters -> 원하는 날짜 변수 설정 (yyyyMMddmmss , now())

try - catch  try  ->  Desktop Automation에 날짜 변수를 전달해 엑셀 데이터를 추출 
                catch ->

For Each File 디렉토리 설정 후 파일 이름의 패턴을 정하고
경로를 복사 한다.

복사한 경로로 이동해 파일을 생성 한다. 

엑셀 파일 해당 경로로 저장한다 .

엑셀을 열어  .xlsx 파일의 확장자를 제거하고 .csv 파일로 바꿔준다 .

첫 번째 컬럼 부터 등록되어 있는 컬럼 정보를 추출한다 . (From First Index - 첫번째 행) 

추가, 변경할 컬럼을 설정 한 후 입력 값(변수)를 넣어준다.

확장자가 .csv인 파일로 저장한다.

자체 엑셀로 헤더를 제작한다.

추출한 데이터를 새로운 엑셀로 옮긴다.

.csv파일을 삭제한다.



---------

기록해 놓기 까다로운.. 작업이다..