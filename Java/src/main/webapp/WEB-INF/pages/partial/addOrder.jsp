<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style>
.ui-helper-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}
.ui-corner-all{
width:400px;
}
</style>
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

<script type ="text/javascript">

/* $(function(){
    var autocompletetext = ["경기 하남시 미사강변대로226번안길 9 [미사1호점]","부산 해운대구 해운대해변로 117 대우마리나2차아파트상가 104호	[동백역점]","경기 광주시 순암로 63 [장지점]","서울 동작구 만양로 6 e편한세상 상도노빌리티 상가 [상도역점]","서울 중구 중림로 10 [충정로역점]","경기 김포시 유현로238번길 31 [풍무역점]","경기 수원시 권선구 동수원로145번길 24 1동 109호 [수원아이파크시티점]","서울 중구 퇴계로 114 [명동역점]","경기 시흥시 은계번영길 1 1층 118호 [시흥은계점]"];
         $("#autocomplete").autocomplete({
            source: autocompletetext
         });
}); */  // 지점명으로 등록이 필요할 경우 사용

function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
        	  var addr = ''; // 주소 변수
              var extraAddr = ''; // 참고항목 변수

              //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
              if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                  addr = data.roadAddress;
              } else { // 사용자가 지번 주소를 선택했을 경우(J)
                  addr = data.jibunAddress;
              }

              // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
              if(data.userSelectedType === 'R'){
                  // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                  // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                  if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                      extraAddr += data.bname;
                  }
                  // 건물명이 있고, 공동주택일 경우 추가한다.
                  if(data.buildingName !== '' && data.apartment === 'Y'){
                      extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                  }
                  // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                  if(extraAddr !== ''){
                      extraAddr = ' (' + extraAddr + ')';
                  }
             
              } 
              // 우편번호와 주소 정보를 해당 필드에 넣는다.
              document.getElementById('postcode').value = data.zonecode;
              document.getElementById("rcvAddr1").value = addr;
              // 커서를 상세주소 필드로 이동한다.
              document.getElementById("detailaddress").focus();
        }
    }).open();
}


</script>
<div class="do_odr _do_odr" style="display:none;">	
	<div class="do_odr_box do_odr_input _do_odr_input">
 		<!-- <h3>주문하기</h3>  -->
		<div class="head_btn_area">
			<button class="btn3 odr_area_btn __add_odr past_odr _show_past_odr">이전 주문 내역 가져오기 ▶</button>
		</div>
		<div class="mid add_odr">
		 	<table class="do_odr_tbl odr_detail_box">
		 		<colgroup>
		 			<col style="width:130px;" />
		 			<col style="width:350px;" />
		 		</colgroup>
		 		<tbody>
		 			<tr class="frst">
		 				<th><span>상품</span></th>
		 				<td>
		 					<button class="btn3 item_sel_btn __add_odr _show_item_sel_layer">품목 선택하기</button>
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>상품코드</span></th>
		 				<td><p class="_add_odr_item_code"></p></td><!-- id="item_code" -->
		 			</tr>
		 			<tr>
		 				<th><span>품목</span></th>
		 				<td><p class="_add_odr_item" id="itemName"></p></td>
		 			</tr>
		 			<tr>
		 				<th><span>형태</span></th>
		 				<td><p class="_add_odr_shape"></p></td>
		 			</tr>
		 			<tr>
		 				<th><span>가공</span></th>
		 				<td><p class="_add_odr_process"></p></td>
		 			</tr>
		 			<tr>
		 				<th><span>배경</span></th>
		 				<td><p class="_add_odr_background"></p></td>
		 			</tr>
		 			<tr>
		 				<th><span>사이즈</span></th>
		 				<td>
		 					<span class="_add_order_width _unable _unable_width">입력불가(가로)</span>
		 					<span class="_add_order_width _fix _fix_width" style="display:none;"></span>
		 					<span class="_add_order_width _input _input_width" style="display:none;">
		 						<input type="text" class="input_txt short _width addorder_input" onkeyup="b2b.addOrder.updateUnitprice();"/>
		 					</span>
		 					&nbsp;&nbsp;X&nbsp;&nbsp;
		 					<span class="_add_order_height _unable _unable_height" >입력불가(세로)</span>
		 					<span class="_add_order_height _fix _fix_height" style="display:none;"></span>
		 					<span class="_add_order_height _input _input_height" style="display:none;">
		 						<input type="text" class="input_txt short _height addorder_input" onkeyup="b2b.addOrder.updateUnitprice();"/>
		 					</span>
		 					&nbsp;&nbsp;X&nbsp;&nbsp;
		 					<span class="_add_order_depth _unable _unable_depth" >입력불가(깊이)</span>
		 					<span class="_add_order_depth _fix _fix_depth" style="display:none;"></span>
		 					<span class="_add_order_depth _input _input_depth" style="display:none;">
		 						<input type="text" class="input_txt short _depth addorder_input" onkeyup="b2b.addOrder.updateUnitprice();"/>
		 					</span>
		 					<p class="do_odr_desc">※ 규격상품은 사이즈 변경이 불가합니다. mm단위로 숫자만 입력하세요.(1m = 100cm = 1,000 mm)</p>
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>단가</span></th>
		 				<td>
		 					<span class="_unitprice _add_order_unitprice" data-price="0">0</span> 원
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>매입가</span></th>
		 				<td>
		 					<span class="_purchaseprice _add_order_purchaseprice" data-purchaseprice="0">0</span> 원
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>수량</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _count" onkeyup="b2b.addOrder.validateNumInput(this);b2b.addOrder.updateUnitprice();b2b.addOrder.updateTotalPrice(this);" onblur="b2b.addOrder.validateNumInput(this);b2b.addOrder.updateTotalPrice(this);" id="itemQty"/>
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>가격</span></th>
		 				<td>
		 					<p><span class="_total_price" data-value="0">0</span> 원</p>
		 					<!-- <p><input class="input_txt  _total_price" data-value="0" value="">원</p>  -->
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>매입총액</span></th>
		 				<td>
		 					<p><span class="_total_purchase_price">0</span> 원</p>
		 					<!-- <p><input class="input_txt  _total_price" data-value="0" value="">원</p>  -->
		 				</td>
		 			</tr>
      <!--<tr>
		 				<th><span>배송</span></th>
		 				<td>
		 					<div class="radio_lst _delivery">
		 						<input type="radio" value="branch" name="dlvr" onclick="b2b.addOrder.showDeliveryInfo(this);" checked="true">
		 						<span>지점 배송</span>  지점배송 x
		 						<input type="radio" value="store" name="dlvr" onclick="b2b.addOrder.showDeliveryInfo(this);">
		 						<span>센터로 배송</span>
		 					</div>
		 				</td>
		 			</tr> B2B 배송이 센터배송 밖에 없으므로 라디오 버튼 사용 X -->
		 			<!-- <tr>
		 				<th><span>지역</span></th>
		 				<td>
		 					<select class="input_sel _team_info">
		 						<option value="">선택하세요</option>
				        <option value="서울">서울</option>
	             	<option value="부산">부산</option>
	             	<option value="대구">대구</option>
	             	<option value="제주">제주</option>
		 					</select>
		 				</td>
		 			</tr> --> <!-- 지역 사용 x -->
		 		  <!-- <tr>
		 				<th><span>매장 주소</span></th>
		 				<td>
    						<input id="autocomplete" type="text" name="autocomplete" class="input_txt long _outlet_detail" >
		 				</td>
		 			</tr> --> <!-- 매장주소 사용 x -->
		 		<!--	<tr>
	 	 				<th><span>매장명</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _outlet_detail" />
		 				</td>
		 			</tr> -->
		 			<!--<tr>
		 				<td colspan="2">
		 					<p class="do_odr_desc">※ 지점배송이 아닌 직배송의 경우 아래 내용을 입력해주세요</p>
		 				</td>
		 			</tr>-->
		 			<tr class="_add_odr_addr" style="display:none;">
		 				<th><span>주소</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _postcode"id="postcode" placeholder="우편번호" readOnly/><input type="button" class="btnPost" onclick="sample6_execDaumPostcode()" value="우편번호 찾기"/>
		 					<input type="text" class="input_txt long _addr" id="rcvAddr1" " readOnly></input>
							<input type="text" class="input_txt long _detailaddress" id="detailaddress" placeholder="상세주소"/>
		 				</td>
		 			</tr>
		 			<tr>
	 	 				<th><span>매장명</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _outlet_detail" />
		 				</td>
		 			</tr>					 			
		 			<tr class="_add_odr_receiver" style="display:none;">
		 				<th><span>수취인명</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _receiver" id="rcvName"/>
		 				</td>
		 			</tr>
		 			<tr class="_add_odr_tel" style="display:none;">
		 				<th><span>전화번호</span></th>
		 				<td>
		 					<input type="text" class="input_txt middle _tel" id="rcvTel1"/>
		 					<p class="do_odr_desc">※ - ,띄어쓰기를 제외하고 입력해주세요.ex)01023456789</p>
		 				</td>
		 			</tr>
<!-- 		 			<tr class="_add_odr_depositor" >
		 				<th><span>입금자명</span></th>
		 				<td>
		 					<input type="text" class="input_txt short _depositor" id="depositor"/>
		 				</td>
		 			</tr>
		 			<tr>
		 				<th><span>계산서 발행</span></th>
		 				<td>
		 					<div class="radio_lst _bill">
		 						<input type="radio" value="세금계산서" name="dlvr" checked="true"  onclick="b2b.addOrder.showBillInfo(this);">
		 						<span>세금계산서</span> 
		 						<input type="radio" value="현금영수증" name="dlvr" onclick="b2b.addOrder.showBillInfo(this);">
		 						<span>현금영수증</span>
		 					</div>
		 						<p class="do_odr_desc" style="color:red;">계산서 발행 요청시 정보 입력은 필수입니다.</p>
		 				</td>
		 			</tr>
		 			<tr class="_add_odr_business">
		 				<th><span>사업자번호</span><br/><span>대표번호</span></br/><span>이메일주소</span></th>
		 				<td>
		 					<input type="text" class="input_txt l_middle _business_num" id="business_num"/>
		 					<p class="do_odr_desc">※사업자번호</p>
		 					<input type="text" class="input_txt l_middle _business_tel" id="business_tel"/>
		 					<p class="do_odr_desc">※대표번호</p>
		 					<input type="text" class="input_txt l_middle _business_email" id="business_email"/>
		 					<p class="do_odr_desc">※이메일주소</p>
		 				</td>
		 			</tr>
		 			<tr class="_add_odr_receipts_tel" style="display:none;">
		 				<th><span>사업자/핸드폰</span></th>
		 				<td>
		 					<input type="text" class="input_txt middle _receipts_tel" id="receiptsTel"/>
		 					<p class="do_odr_desc">※발행받으실 등록번호를 남겨주세요.</p>
		 					<p class="do_odr_desc">　　　　　(사업자/휴대폰)</p>
		 				</td>
		 			</tr> -->
		 			<tr>
		 				<th>
		 					<span>상세설명</span>
		 				</th>
		 				<td>
		 					<textarea rows="5" class="do_odr_detail_desc _desc"></textarea>
		 					
		 				</td>
		 				
		 			</tr>
		 			<tr>
		 				<th>
		 					<span>파일첨부</span>
		 				</th>
		 				<td>
		 					<button type="button" class="btn btn3 select_attach_file __add_odr _select_attach_file">파일 선택하기</button>
		 					<div class="add_odr_attach_file_area _add_odr_attach_file_area">
		 						<span class="_add_odr_attach_file"></span>
		 					</div>
		 					<i class = "f-up-desc">20MB까지 첨부 가능합니다</i>
		 				</td>
		 			</tr>
		 			<tr>
		 				<th>
		 					<span>이전주문 번호</span>
		 				</th>
		 				<td>
		 					<span class="_past_odr"></span>
		 				</td>
<!-- 		 				<tr>
		 				<th><span>송장번호</span></th>
		 				<td>
		 					<select class="input_sel _invoice_info">
		 						<option value="">배송정보</option>
				        <option value="롯데택배">롯데택배</option>
	             	<option value="퀵배송">퀵배송</option>
		 					</select>
		 					<input type="text" class="input_txt middle _invoice_number" /> 
		 					<p class="do_odr_invoiceNumer">※배송 관리자만 입력하세요.</p>
		 				</td>
		 			</tr> -->
		 		</tbody>
		 	</table>
		 	<div class="bgrnd_img add_odr _add_odr_bgrnd_img">
				<img src="/img/product_default_img_${company}.png" onerror="this.style.display = 'none';" />
			</div>
		</div>
		<div class="footer_btn_area">
	 		<button type="button" class="btn btn2 odr_area_btn __add_odr _new_adrs_add_odr">+&nbsp;&nbsp;주문 추가</button>
	 		<button type="button" class="btn btn2 odr_area_btn last __add_odr _same_adrs_add_odr">+&nbsp;&nbsp;동일 배송지 주문 추가</button>
	 	</div>	 	
	</div>
	<button type="button" class="btn do_odr_ok __add_odr _submit_odr">주문 완료</button>
</div>

<div class="past_order_ly _past_order_ly" style="display:none;">
	<h3 class="header">이전 주문 목록</h3>
	<table class="tbl_a">
		<colgroup>
			<col width="320px;">
			<col width="90px;">
		</colgroup>
		<thead>
			<tr>
				<th>제목</th>
				<th>등록일</th>
			</tr>
		</thead>
		<tbody class="_past_order_list">
		</tbody>
	</table>
	<div class="page_area _page_area">
		<button type="button" class="__add_odr nav_arw _prev _past_order_page"><</button>
		<span class="cnt_pg _current_page"></span>
		<span>&nbsp;/&nbsp;</span>
		<span class = "_total_page"></span>
		<button type="button" class="__add_odr nav_arw _next _past_order_page">></button>
    </div>
	<div class="btn_area">
		<button type="button" class="btn3 btn close" onclick="b2b.addOrder.hidePastOrderLayer();">닫기</button>
	</div>
</div>
