<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import ="net.fe.buma.support.enumeration.*" %>
<%@ page import ="net.fe.buma.order.model.*"%>
<%@ page import ="net.fe.buma.stats.model.*"%>
<%
String id = (String)session.getAttribute("id");
String otp = (String)session.getAttribute("OTP");
%>

<div class="do_odr _odr_stat" style="display:none;">
	<div class="cont_phase _cont_phase" style="display:none;">
		<ul>
			<li class="cont_nav_item on"><a href="#" class="__stat _change_stat_type" data-type="order">주문통계</a></li><!--
			--><li class="cont_nav_item"><a href="#" class="__stat _change_stat_type" data-type="payment">결제통계</a></li><!--
			--><li class="cont_nav_item"><a href="#" class="__stat _change_stat_type" data-type="timelog">타임로그</a></li>
		</ul>
	</div>
	<div class="do_odr_box stat_search_option_box">
		<table class="_search_opt_tbl">
			<colgroup>
				<col style="width:10%"></col>
				<col style="width:23.3%"></col>
				<col style="width:10%"></col>
				<col style="width:23.3%"></col>
				<col style="width:10%"></col>
				<col style="width:23.3%"></col>
			</colgroup>
			<tbody>
				<tr> 
					<td><span>주문자</span></td>
					<td><input type="text" class="input_txt middle _customer_opt" value="${user.username}" ></td>
					<td><span>품목</span></td>
					<td><select class="input_sel _item_opt">
						<option value="">품목</option>
						
						</select>
					</td>
					<td><span>진행상태</span></td>
					<td><select class="input_sel _stat_opt">
						<option value="">진행상태</option>
					</select></td>
				</tr>	
				<tr>
            <!--<td>지역</td>
					<td><select class="input_sel _team_info _team_opt">
	 						<option value="">선택하세요</option>
			       	<option value="서울">서울</option>
             	<option value="부산">부산</option>
             	<option value="대구">대구</option>
             	<option value="제주">제주</option>
	 					</select></td>
	 					
	 					
					<td>업장명</td>
					<td><input type="text" class="input_txt short _outlet_opt"></td> 
					
				</tr>  지역 및 업장명 사용 X-->
				<tr>
					<td><span>기간</span></td>	
					<td colspan="5">
						<input type="text" class="input_txt short date _stat_date_from">&nbsp;&nbsp;~&nbsp;&nbsp;</span>
						<input type="text" class="input_txt short date _stat_date_to">
						<input type="checkbox" class="_unit_zero"/> 수량 0개
						<input type="checkbox" class="_price_zero" /> 가격 0원
					</td>
				</tr>
				<tr>
					<td colspan="6" class="btn_area">
						<button type="button" class="btn btn2 __stat _search"><i class="fa fa-search" style="line-height:1px;"></i> &nbsp;&nbsp;검&nbsp;&nbsp;색</button>
					</td>
				</tr>
			</tbody>
		</table>
		</div>
		<div class="stat_btn_area _stat_btn_area">
			<!-- <a href="/stats/order/print" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-print"></i> 인쇄
				</button>
			</a> -->
			<a href="/stats/order/excel" target="_blank">
				<button type="button" class="btn3 _btnExcel">
					<i class="fa fa-file-excel-o"></i>주문내역 엑셀
				</button>
			</a>
		<a href="/stats/order/printExcel" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-book"></i>주문내역 보기
				</button>
			</a>
			<!--  
			<a href="/stats/order/itemList" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-list"></i> 품목표
				</button>
			</a>
			-->
			<a href="/stats/order/label" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-sticky-note"></i> 라벨
				</button>
			</a>
			<!-- 
			<a href="/stats/order/delivery" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-truck"></i> 택배
				</button>
			</a>
			 -->
<!-- 			<a href="/stats/order/invoice" target="_blank">
				<button type="button" class="btn3">
					<i class="fa fa-pencil-square"></i> 송장
				</button>
			</a> 지역으로 나오는 송장-->
		  <!-- <a href="/stats/order/testFlow">
				<button type="button" class="btn3 _generateId">
					<i class="fa fa-sticky-note"></i> id발급
				</button>
			</a>  현재 사용 X-->
			<!--  송장출력 폼 hidden 2019-10-28  -->
			<%-- <button type="button" class="btn3 _invoicePrint">송장출력</button>
			<form target="bumaPopup" action="http://test.goodsflow.com/print/dlvmgr.aspx" class="invoiceForm" name="">
			        <div>
			             <input type="hidden" name="id" value=<%=id %>>
			        </div>
			        <div>
			             <input type="hidden" name="OTP" value=<%=otp %>>
			        </div>
			        <div>
			             <input type="hidden" name="responseURL" value="http://hanchon.bumaprint.com/stats/order/responseSheetNo">
			        </div>
			 </form> 
		</div>
		<div class="stat_result_lst">
			<table class="tbl_a _stat_result_area" style="display:none;">
				<colgroup>
					<col width="30px"></col>
					<col width="70px"></col>
					<col width="40px"></col>
					<col width="40px"></col>
					<col width="60px"></col>
					<col width="50px"></col>
					<col width="60px"></col>
					<col width="80px"></col>
					<col width="50px"></col>
					<col width="50px"></col>
					<col width="80px"></col>
					<col width="40px"></col>
					<col width="40px"></col>
					<col width="30px"></col>
					<col width="50px"></col>
				</colgroup>
				<thead>
					<tr>
						<th>번호</th>
						<th>주문일시</th>
						<th>주문번호</th>
						<th>매장명</th>
						<th>주문자</th>
						<th>품목</th>
						<th>구분</th>
						<th>가공</th>
						<th>템플릿</th>
						<th>사이즈</th>
						<th>단가</th>
				    <!--<th>지역</th>
						<th>매장명</th>
						<th>우편번호</th>
						<th>직배송주소</th>
						<th>상세주소</th>
						<th>수취인</th> -->
						<th>수량</th>
						<th>가격</th>
						<th>진행상태</th>
						<!-- <th>배송구분</th> -->
						<!-- <th>송장번호</th> -->
					</tr>
				</thead>
				<tbody class="_stat_result_list">
					 <tr>
						<td>1</td>
						<td>중구점</td>
						<td>냉장고시트</td>
						<td>Topboard시트</td>
						<td>무광</td>
						<td>커스텀디자인</td>
						<td>200 x 100</td>
						<td>5600</td>
						<!-- <td>3</td>
						<td>0</td> --><!-- 
						<td>서울(북부)</td>
						<td>비어카페비(대학로)</td>
						<td>서울시 중구필동2가</td>
						<td>관리자</td> -->
						<td>2015-11-01 15:05:41</td>
						<td>이연희</td>
						<td>발송완료</td>
						<!-- <td>롯데택배</td> -->
						<!-- <td>105080819</td> -->
					</tr>
				</tbody>
			</table>
	</div>
</div>