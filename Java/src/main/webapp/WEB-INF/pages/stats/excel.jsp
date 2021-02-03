<%@ page language="java" contentType="application/vnd.ms-excel;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%
    response.setHeader("Content-Disposition","attachment;filename=stats.xls");
    response.setHeader("Content-Description", "JSP Generated Data");
	response.setContentType("application/vnd.ms-excel");
	
/* 	<th>번호</th>
	<td><td>${status.index + 1}</td> */
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
table {border-collapse:collapse;width:100%;text-align:center;font-size:12px;}  
table th, table td {border:1px solid black;}
table th {background-color:#c0c0c0;}
</style>
</head>
<body>
	<table>
		<tbody>
			<tr>
				<th>상품주문번호</th>
				<th>주문 일자</th>
				<th>자체상품코드</th>
				<th>상품명</th>
				<th>매입가</th>
				<th>출고가</th>
				<th>상품수량</th>
				<th>매입총액</th>
				<th>매출총액</th>
				<th>주문자 이름</th>
		        <th>주문자 전화번호</th>
				<th>수취인 이름</th>
				<th>수취인 우편번호</th>
				<th>수취인 전체주소</th>
				<th>수취인 핸드폰 번호</th>
				<th>입고요청일</th>
				<th>주문시 남기는 글</th>
			</tr>
			<c:forEach items="${resultList}" var="order" varStatus="status">
			<tr>
				<td>${order.seq}</td>
				<td>${order.registered}</td>
				<td>${order.item_code}</td>
				<td>${order.title}</td>
				<td>${order.purchaseprice}</td>
				<td>${order.unitprice}</td>
				<td>${order.count}</td>
				<td>${order.purchase_price}</td>
				<td>${order.price}</td>
				<td>${order.username}</td>
		        <td>${order.mobile}</td>
				<td>${order.sender_name}</td>
				<td>${order.sender_postcode}</td>
				<td>${order.sender_address}  ${order.sender_detailaddress}</td>
				<td>${order.sender_phone}</td>
				<td>${order.fromDate}</td>
				<td>${order.description}</td>
			</tr>
			</c:forEach>
		</tbody>
	</table>
</body>
</html>