<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<div class="odr_lst _odr_lst" style="display:none;">
	<div class="cont_phase _cont_phase">
		<ul>
			<li class="cont_nav_item on"><a href="#orderList?status=ALL" data-status="ALL" class="_nav_phase">전체</a></li><!--
			--><li class="cont_nav_item"><a href="#orderList?status=L1" data-status="L1" class="_nav_phase">접수</a></li><!--
			--><li class="cont_nav_item"><a href="#orderList?status=L2" data-status="L2" class="_nav_phase">디자인</a></li><!--	
			--><li class="cont_nav_item"><a href="#orderList?status=L3" data-status="L3" class="_nav_phase">제작</a></li><!--							
			--><li class="cont_nav_item"><a href="#orderList?status=L4" data-status="L4" class="_nav_phase">발송</a></li><!--
			--><li class="cont_nav_item"><a href="#orderList?status=L5" data-status="L5" class="_nav_phase">입금</a></li><!--
			--><li class="cont_nav_item"><a href="#orderList?status=L6" data-status="L6" class="_nav_phase">계산서발행</a></li><!--
			--><li class="cont_nav_item"><a href="#orderList?status=L7" data-status="L7" class="_nav_phase">보류</a></li><!--
			--><!-- <li class="cont_nav_item"><a href="#" class="__order_list _nav_phase" data-status="L6">반려</a></li>-->
		</ul>
	</div>
	<div class="cont_header">
		<div class="search_order_area">
			<div class="_search_order_inpt search_order_inpt">
				<select class="_search_order_type">
					<option value="userid" selected>주문자</option>
					<option value="team">지역</option>
					<option value="outlet_detail">업장명</option>
					<option value="content">내용</option>
				</select>
				<input type="text" class="_search_order_value">
				<button type="button" class="_search_order_btn __order_list">검색</button>
			</div>
		</div>
		<span class="cont_page _cont_page">
		</span>
	</div>
	<div class="odr_list_wrap _odr_list_wrap">			
	</div>
	<div class="cont_footer">
		<span class="cont_page _cont_page">							
		</span>
	</div>
</div>
