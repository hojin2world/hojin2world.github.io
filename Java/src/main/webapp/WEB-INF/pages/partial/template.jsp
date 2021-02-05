<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<script type="text/template" id="template_data">
	<!--TPL:SEPARATOR-->
	<div class="_add_odr_lst_box do_odr_box do_odr_lst_box">
		<h3>주문 목록</h3>
		<button type="button" class="btn3 __add_odr _clear_selected_add_order">선택 삭제</button>
		<button type="button" class="btn3 __add_odr _clear_all_add_order">모두 삭제</button>
		<table>
			<colgroup>
				<col style="width:50px;">
				<col style="width:450px;">
				<col style="width:100px;">
				<col style="width:80px;">
				<col style="width:110px;">
			</colgroup>
			<thead>
				<tr>
					<td></td>					
					<td>주문 상세</td>
					<td>단가</td>
					<td>수량</td>
					<td>가격</td>
				</tr>
			</thead>
			<tbody>
				<tr class="prc_tot _prc_tot">
					<td colspan="2">
					</td>
					<td class="prc_result" colspan="2">
						<p>총계</p>
					</td>
					<td class="prc_result">
						<p><span class="_total">0</span>원</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!--TPL:SEPARATOR-->
	<tr class="_add_odr_lst_item" data-index="{=INDEX}">
		<td><input type="checkbox"></td>		
		<td>
			<p>{=TITLE}</p>
		</td>
		<td><p>{=UNITPRICE}</p></td>
		<td><p>{=COUNT}</p></td>
		<td><p>{=PRICE}</p></td>
	</tr>

	<!--TPL:SEPARATOR-->
	<div class="_tmpl_order odr" data-orderseq="{=ODR_SEQ}">
		<!--
		<div class="odr_thmb">
			<img src="{=odr_img}">
		</div>
		-->
		<a href="#orderDetail?seq={=ODR_SEQ}">
		</a>
		<div class="odr_cont">
			<div class="odr_head">
				<span class="odr_num __order_list _view_order">{=ODR_NUM}</span>
				<span class="odr_type __order_list _view_order" style="color:red;"> [ {=ODR_TYPE} ] </span>
				<span class="odr_tit __order_list _view_order">{=TITLE}</span>
				<span class="odr_tit __order_list _view_order">-{=TEAM}-</span>
				<span class="odr_tit __order_list _view_order">{=SENDER_ADDRESS}</span>
				<span class="odr_date __order_list _view_order">{=DATE}</span>
			</div>
			<div class="odr_man">
				<span class="odr_from __order_list _view_order" ><span>{=USERNAME}</span> | {=SENDER_POSTCODE} {=SENDER_ADDRESS} {=SENDER_DETAILADDRESS} | {=SENDER_NAME}</span>
				<span class="odr_charge __order_list _view_order" >| <span> {=CHARGE_MAN}</span></span>
			</div>
			<div class="odr_repl">
				<span class="odr_repl_head __order_list _view_order">최근댓글</span>
				<span class="odr_repl_cont __order_list _view_order">{=COMMENT}</span>
				<span class="odr_repl_from __order_list _view_order">{=COMMENT_AUTHOR}</span>
				<span class="odr_repl_cnt __order_list _view_order">[{=COMMENT_COUNT}]</span>
			</div>
		</div>	
	</div>

	<!--TPL:SEPARATOR-->
		<div class="_tmpl_order_detail do_odr_box do_odr_input" data-orderstatus="{=ORDER_STATUS}" data-orderseq="{=SEQ}">			
			<h3>
				<span class="seq">{=ODR_NUM}</span> 
				<span class="stat">[{=ORDER_STATUS_NAME}]</span>
				<span>{=TITLE}</span>
				<span>-{=TEAM}-</span>
				<span>{=SENDER_ADDRESS}</span>
			</h3>
			<p class="info">
				<span data-userid={=USERID} 
					onclick="b2b.userLayer.showLayer(this);">
					주문자: {=USERNAME}
				</span> | 
				<span data-userid={=WORKERID} class="_worker_name"
					onclick="b2b.userLayer.showLayer(this);" >
					 담당자: {=WORKERNAME}
				</span> | 
				<span style="date">{=REGISTERED}</span>
			</p>
			<div class="complete_panel_area _complete_panel_area" style="display:none;">
				<span class="complete_panel _complete_panel_deposited" style="display:none">
					입금 (<span class="_deposited"></span>)
				</span>
				<span class="complete_panel _complete_panel_designed" style="display:none">
					디자인 (<span class="_designed"></span>)
				</span>
				<span class="complete_panel _complete_panel_produced" style="display:none">
					제작 (<span class="_produced"></span>)
				</span>
				<span class="complete_panel _complete_panel_delivered" style="display:none">
					발송 (<span class="_delivered"></span>)
				</span>
				<span class="complete_panel _complete_panel_billed" style="display:none;">
					계산서 발행 완료 (<span class="_billed"></span>)
				</span>
			</div>
			<div class="head_btn_area _head_btn_area">
				<button type="button" class="btn3 odr_area_btn __order_detail _order_cancel odr_detail_modify" style="display:{=IS_EDITABLE}"><i class="fa fa-close"></i> 삭제</button>
				<button type="button" class="btn3 odr_area_btn __order_detail _order_modify odr_detail_modify" style="display:{=IS_EDITABLE}"><i class="fa fa-pencil"></i> 수정</button>
				<button type="button" class="btn btn3 odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L7" style="display:{=IS_EDITABLE}">보류</button>
				<button type="button" class="btn {=BTN_CLASS_L6} odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L6" style="display:{=IS_EDITABLE}">계산서 발행</button>
				<button type="button" class="btn {=BTN_CLASS_L5} odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L5" style="display:{=IS_EDITABLE}">입금 완료</button>
				<button type="button" class="btn {=BTN_CLASS_L4} odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L4" style="display:{=IS_EDITABLE}">발송 완료</button>
				<button type="button" class="btn {=BTN_CLASS_L3} odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L3" style="display:{=IS_EDITABLE}">제작 완료</button>
				<button type="button" class="btn {=BTN_CLASS_L2} odr_area_btn __order_detail _change_stat odr_detail_modify" data-status="L2" style="display:{=IS_EDITABLE}">디자인 완료</button>
				<!--
				<button type="button" class="btn3 odr_area_btn __order_detail _show_stat_list odr_detail_modify stat_change">상태 변경</button>
 				-->
				<div class="stat_list _stat_list" style="display:none;">
					<ul></ul>
				</div>
				<button type="button" class="btn {=BTN_CLASS_SAMPLE} odr_area_btn __order_detail _show_img_upload odr_detail_modify">시안 업로드</button>
				<button type="button" class="btn3 odr_area_btn __order_detail _select_worker odr_detail_modify" style="display:{=IS_EDITABLE}">담당자 선택</button>
				<button type="button" class="btn3 odr_area_btn __order_detail _back_to_list odr_detail_modify">목록 보기</button>
				<button type="button" class="btn3 odr_area_btn __order_detail _re_order odr_detail_modify">재주문하기</button>
			</div>
			<div class="mid">
				<div class="_past_order">
					<a href="#orderDetail?seq={=PAST_ODR}" >
						<button type="button" class="btn btn3 odr_detail_past_btn" style="display:{=PAST_ODR_SHOW};">
							이전 주문: <span>{=PAST_ODR_CODE}</span> &nbsp;>
						</button>
					</a>
				</div>
		 		<table class="do_odr_tbl odr_detail_box">
		 			<colgroup>
		 				<col style="width:130px;"></col>
		 				<col style="width:280px;"></col>
		 			</colgroup>
		 			<tbody>
		 				<tr class="frst">
		 					<th><span>품목</span></th>
		 					<td><p class="_add_odr_item">{=ITEM}</p></td>
		 				</tr>
						<tr>
		 					<th><span>자체상품코드</span></th>
		 					<td><p class="_add_odr_item_code">{=ITEM_CODE}</p></td>
		 				</tr>
		 				<tr>
		 					<th><span>형태</span></th>
		 					<td><p class="_add_odr_shape">{=SHAPE}</p></td>
		 				</tr>
		 				<tr>
		 					<th><span>가공</span></th>
		 					<td><p class="_add_odr_process">{=PROCESS}</p></td>
		 				</tr>
		 				<tr>
		 					<th><span>배경</span></th>
		 					<td><p class="_add_odr_template">{=BACKGROUND}</p></td>
		 				</tr>		 			
		 				<tr>
		 					<th><span>사이즈</span></th>
		 					<td>
		 						<span>{=WIDTH} {=HEIGHT} {=DEPTH}</span>
		 					</td>
		 				</tr>
		 				<tr>
		 					<th><span>단가</span></th>
		 					<td>
		 						<p><span class="_each_price" data-value="{=UNITPRICE}">{=UNITPRICE}</span> 원</p>
		 					</td>
		 				</tr>
						<tr>
		 					<th><span>매입가</span></th>
		 					<td>
		 						<p><span class="_purchase_price" data-value="{=PURCHASEPRICE}">{=PURCHASEPRICE}</span> 원</p>
		 					</td>
		 				</tr>
		 				<tr>
		 					<th><span>수량</span></th>
		 					<td>
		 						<p>{=COUNT}</p>
		 					</td>
		 				</tr>
		 				<tr>
		 					<th><span>가격</span></th>
		 					<td>
		 						<p>{=PRICE} 원</p>
		 					</td>
		 				</tr>
						<tr>
		 					<th><span>매입총액</span></th>
		 					<td>
		 						<p>{=PURCHASE_PRICE} 원</p>
		 					</td>
		 				</tr>
		 				<tr>
		 					<th><span>주소</span></th>
		 					<td><p>{=SENDER_POSTCODE}</p><p class="order_desc_addr">{=SENDER_ADDRESS}</p><p>{=SENDER_DETAILADDRESS}</p></td>
		 				</tr>
						<tr>
		 					<th><span>매장명</span></th>
		 					<td><p>{=OUTLET_DETAIL}</p></td>
		 				</tr>			 			
		 				<tr>
		 					<th><span>수취인명</span></th>
		 					<td><p>{=SENDER_NAME}</p></td>
		 				</tr>
		 				<tr>
		 					<th><span>전화번호</span></th>
		 					<td><p>{=SENDER_PHONE}</p></td>
		 				</tr>
						<tr>
		 					<th><span>입금자명</span></th>
		 					<td><p>{=DEPOSITOR}</p></td>
		 				</tr>
			 			<tr>
		 					<th><span>계산서발행</span></th>
		 					<td><p>{=BILL}</p></td>
		 				</tr>
						<tr>
		 					<th><span>사업자번호</span></th>
		 					<td><p>{=BUSINESS_NUM}</p></td>
		 				</tr>
						<tr>
		 					<th><span>대표번호</span></th>
		 					<td><p>{=BUSINESS_TEL}</p></td>
		 				</tr>
						<tr>
		 					<th><span>이메일주소</span></th>
		 					<td><p>{=BUSINESS_EMAIL}</p></td>
		 				</tr>
						<tr>
		 					<th><span>사업자/핸드폰</span></th>
		 					<td><p>{=RECEIPTS_TEL}</p></td>
		 				</tr>
						<tr>
		 					<th><span>상세설명<span></th>
		 					<td><p class="order_desc_detail">{=DESCRIPTION}</p></td>
		 				</tr>
		 			</tbody>
				</table>
				<div class="bgrnd_img">
					<img src="{=BACKGROUND_IMG}" onerror="this.style.display = 'none';" />
				</div>
			</div>
			<div class="_draft_area draft_area">
				<p>등록된 시안</p>
				<div class="odr_draft_img_lst_box _odr_draft_img_lst_box">
					<!--
					<div class="side"><</div>
					-->
					<ul>					
		 			</ul>
					<!--
		 			<div class="side">></div>
					-->
		 		</div>
				<button type="button" class="btn3 odr_draft_img_toggle __order_detail _toggle_draft_img_btn _enlarge_img_btn">▼ 크게보기</button>
				<button type="button" class="btn btn2 odr_draft_confirm __order_detail _confirm_sample">
					<i class="fa fa-check"></i> 시안 승인
				</button>
				<button type="button" class="btn3 odr_draft_del __order_detail _delete_sample" style="display:{=IS_EDITABLE}">
					시안 삭제
				</button>
			</div>
			<div class="odr_draft_img_box _odr_draft_img_box" style="display:none;">
		 		<a href="#" class="_clk_arrow_prev __order_detail">
		 			<div class="clk_arrow prev _clk_arrow_prev __order_detail">
		 				<i class="fa fa-angle-left _clk_arrow_prev __order_detail"></i>
		 			</div>
		 		</a>
		 		<a href="#" class="_clk_arrow_next __order_detail">
		 			<div class="clk_arrow next _clk_arrow_next __order_detail">
		 				<i class="fa fa-angle-right _clk_arrow_next __order_detail"></i>
		 			</div>
		 		</a>
		 		<img class="__order_detail _draft_img" src="/img/b2b_empty.jpg" onmousemove="b2b.orderDetail.changeCursor(event, this);">
		 	</div>
			<div class="_attach_file_area attach_file_area">
				<p>첨부파일<span class = "attach_file_desc"> - 파일 선택 후 '선택 파일 업로드' 버튼을 클릭해야 파일이 등록됩니다.</span></p>
				<div class="odr_attach_file_lst_box _odr_attach_file_lst_box">					
				</div>
				<button type="button" class="btn btn3 __order_detail _input_attach_file attach_file_btn">파일 선택하기</button>
				<span class="_selected_attach_file_area" style="display: none;">
					<button type="button" class="__file_uploader _attach_file_upload btn btn2">선택 파일 업로드</button>
					<span class="_selected_attach_file_name"></span>
				</span>
			</div>
			<!-- 
		 	<button type="button" class="btn btn2 do_odr_ok __order_detail _pass_order">주문 진행 ({=ORDER_STATUS_NAME_NEXT})</button>
			-->
		</div>

	<!--TPL:SEPARATOR-->
	
	<div class="_odr_attach_file_item_tmpl odr_attach_file_item" data-seq="{=SEQ}">
		<a class="__order_detail _download_attach_file"  href="/file/download/orderAttachFile?seq={=SEQ}" target="_blank">
			<i class="fa fa-file-o"></i>
			<span class="odr_attach_file_name">{=ORIGINAL_FILENAME} {=SIZE}</span>
			<a href="#" class="__order_detail _del_attach_file">
				<i class="fa fa-times-circle __order_detail _del_attach_file"></i>
			</a>
		</a>
	</div>

	<!--TPL:SEPARATOR-->
	
	<div class="_customer_attach_file_item_tmpl odr_attach_file_item" data-seq="{=SEQ}">
		<a class="__customer_board _download_attach_file" href="/file/download/customerAttachFile?seq={=SEQ}" target="_blank">		
			<i class="fa fa-file-o"></i>
			<span class="odr_attach_file_name">{=ORIGINAL_FILENAME} {=SIZE}</span>
		</a>
		<a href="#" class="__customer_board _del_attach_file">
			<span class="_odr_attach_file_del_btn __customer_board _del_attach_file">X</span>
		</a>		
	</div>	

	<!--TPL:SEPARATOR-->
	<div class="_odr_cmt_box_tmpl odr_cmt_box">
		<ul class="_cmt_list">			
		</ul>
		<div class="cmt_input">
			<textarea rows="3"></textarea>
			<button class="btn3 cmt_input_btn __order_detail _input_comment">댓글 입력</button>
		</div>
	</div>

	<!--TPL:SEPARATOR-->
	<li class="_odr_cmt_item_tmpl" data-commentseq="{=COMMENT_SEQ}">
		<dl class="cmt_item">
			<dt class="cmt_head">
				<span class="cmt_author">{=USERNAME}</span>
				<span class="cmt_date">{=DATE}</span>
				<span class="cmt_btns" style="display:{=EDITABLE};">
					<a href="#" class="__order_detail _cmt_modify_cancel_btn" style="display:none;">취소</a>
					<a href="#" class="__order_detail _cmt_modify_btn">수정</a> |
					<a href="#" class="__order_detail _cmt_del_btn">삭제</a>
				</span>
			</dt>
			<dt class="cmt_desc">{=CONTENT}</dt>
		</dl>
		<div class="cmt_modify _cmt_modify" style="display:none;">
			<textarea class="cmt_modify_input" ></textarea>
			<button type="button" class="btn btn3 cmt_modify_submit __order_detail _cmt_modify_submit">수정</button>
		</div>
	</li>

	<!--TPL:SEPARATOR-->
	<div class="_dlvr_result dlvr_result ">
		<p class="dlvr_titl">{=DATE} 배송 목록</p>
		<div class="dlvr_local">
			<table>
				<colgroup>
					<col style="width:15%"></col>
					<col style="width:85%"></col>
				</colgroup>
				<tbody>
					{=INVOICE_LIST}
				</tbody>
			</table>
				<button type="button" class="btn3 __delivery _show_delete" data-date="{=DATA_DATE}">삭제&nbsp;&nbsp;<i class="fa fa-pencil"></i></button>
				<button type="button" class="btn3 __delivery _show_modify" data-date="{=DATA_DATE}">수정&nbsp;&nbsp;<i class="fa fa-pencil"></i></button>
			
		</div>
		<div class="dlvr_lst">
			{=DELIVERY_CARD_LIST}
		</div>
	</div>

	<!--TPL:SEPARATOR-->
	<tr class="_dlvr_invoice">
		<th>{=LOCATION}</th>
		<td>{=INVOICE_LIST}</td>
	</tr>

	<!--TPL:SEPARATOR-->
	<div class="_dlvr_card dlvr_card">
		<div class="head">
			<p>{=LOC} ( 송장번호 : {=INVOICE_NUM} ) </p>
			<button type="button" class="__delivery _toggle_card">
				<i class="fa fa-angle-down __delivery _toggle_card"></i>
			</button>
		</div>
		<div>
			<table>
				<colgroup>
					<col style="width:10%"></col>
					<col style="width:10%"></col>
					<col style="width:30%"></col>
					<col style="width:50%"></col>
				</colgroup>
				<thead>			
					<tr>
						<td>일자</td>
						<td>시간</td>
						<td>지점 / 영업소연락처</td>
						<td>이동상태</td>
					</tr>
				</thead>
				<tbody>
					{=STATUS_LIST}
				</tbody>
			</table>
		</div>
	</div>

	<!--TPL:SEPARATOR-->
	<tr class="_dlvr_stat" style="display:{=DISPLAY};">
		<td>{=DATE}</td>
		<td>{=TIME}</td>
		<td>{=PLACE}</td>
		<td>{=DETAIL}</td>
	</tr>

	<!--TPL:SEPARATOR-->
	<tr class="_stats_row">
		<td>{=INDEX}</td>
		<td>{=REGISTERED}</td>
		<td><a href="http://b2b.bumaprint.com/#orderDetail?seq={=SEQ}" target="_blank" style="color:blue">{=ORDERSEQ}</a></td>
		<td>{=OUTLET_DETAIL}</td>
		<td>{=USERNAME}</td>
		<!--<td>{=ITEM_CODE}</td>-->
		<td>{=ITEM}</td>
		<td>{=SHAPE}</td>
		<td>{=PROCESS}</td>
		<td>{=BACKGROUND}</td>
		<td>{=WIDTH} x {=HEIGHT} {=DEPTH}</td>
		<!--<td>{=PURCHASEPRICE}</td>-->
		<td>{=UNITPRICE}</td>
		<td>{=COUNT}</td>
		<!--<td>{=PURCHASE_PRICE}</td>-->
		<td>{=PRICE}</td>
		<td>{=ORDER_STATUS}</td>
		<!--<td>{=INVOICE_INFO}</td> 굿스플로 사용시 주석해제-->
		<!--<td><a href="https://b2c.goodsflow.com/zkm/V1/whereis/BUMA/HYUNDAI/{=INVOICE_NUMBER}" target="_blank">배송추적</a></td>굿스플로 사용시 주석해제-->
	</tr>

	<!--TPL:SEPARATOR-->
	<tr class="_stats_total_row">
		<td  class="tot_prc" colspan="21">합 계 <span class="_stats_tot_price">{=TOTAL_PRICE}</span> 원</td>
	</tr>

	<!--TPL:SEPARATOR-->
	<li class="_product_piece_tmpl">
		<div class="item __add_odr _select_product" data-id="{=ID}" data-name="{=NAME}">
			<a href="#" class="__add_odr _select_product_c">{=NAME}</a>
		</div>
	</li>

	<!--TPL:SEPARATOR-->
	<li class="_smpl_type_tmpl smpl_typ">
		<a href="#" class="__sample _select_sample_type" data-id="{=ID}">{=NAME}</a>
	</li>
	
	<!--TPL:SEPARATOR-->
	<div class="_modify_odr_lst_box do_odr_box do_odr_lst_box">
		<h3>주문 목록</h3>
		<button type="button" class="btn3 __add_odr _clear_selected_add_order">선택 삭제</button>
		<button type="button" class="btn3 __add_odr _clear_all_add_order">모두 삭제</button>
		<table>
			<colgroup>
				<col style="width:40px;">
				<col style="width:90px;">
				<col style="width:300px;">
				<col style="width:70px;">
				<col style="width:50px;">
				<col style="width:90px;">
			</colgroup>
			<thead>
				<tr>
					<td></td>
					<td>샘플 이미지</td>
					<td>주문 상세</td>
					<td>단가</td>
					<td>수량</td>
					<td>가격</td>
				</tr>
			</thead>
			<tbody>
				<tr class="prc_tot _prc_tot">
					<td colspan="3">
					</td>
					<td class="prc_result" colspan="2">
						<p>총계</p>
					</td>
					<td class="prc_result">
						<p><span class="_total">0</span>원</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!--TPL:SEPARATOR-->
	<tr class="_modify_odr_lst_item" data-index="{=INDEX}">
		<td><input type="checkbox"></td>
		<td><img src="{=IMG}" class="do_odr_img"></td>
		<td>
			<p>{=TITLE}</p>
		</td>
		<td><p>{=UNIT_PRICE}</p></td>
		<td><p>{=COUNT}</p></td>
		<td><p>{=PRICE}</p></td>
	</tr>

	<!--TPL:SEPARATOR-->
	<li class="_modify_product_piece_tmpl">
		<div class="item __order_modify _select_product" data-id="{=ID}" data-name="{=NAME}">
			<a href="#" class="__order_modify _select_product_c">{=NAME}</a>
		</div>
	</li>

	<!--TPL:SEPARATOR-->
	<li class="_sample_img_tmpl" data-seq="{=SEQ}">
		<div class="confirm_ly __order_detail _enlarge_img" style="display:{=CONFIRMED};"></div>
		<div class="confirm_ct" style="display:{=CONFIRMED};">
			<i class="fa fa-check __order_detail _enlarge_img"></i> 
			<span>승인</span>
		</div>
		<a href="#" class="__order_detail _enlarge_img">
			<img class=" __order_detail _enlarge_img_c" src="/file/download/sample?sampleId={=SEQ}" width="90" height="90">
		</a>
	</li>

	<!--TPL:SEPARATOR-->
	<div class="_smpl_card smpl_card __sample _show_sample" data-orderid="{=ORDERID}">
		<a href="#" class="__sample _show_sample">
			<img class="__sample _show_sample _unloaded" src="/file/download/sample?sampleId={=SEQ}" onload="b2b.sample.checkAllLoad(this);" onerror="this.style.display = 'none';b2b.sample.checkAllLoad(this);">
		</a>
		<div class="smpl_card_footer">
			<span class="smpl_card_nm _smpl_card_nm">{=ITEM}{=SHAPE}</span>
			<button type="button" class="__sample _add_order_from_sample">
				<i class="fa fa-edit"></i>&nbsp;주문하기
			</button>
		</div>
	</div>	

	<!--TPL:SEPARATOR-->
	<div class="_noti_board_item noti_board_item {=READ}" data-seq="{=SEQ}">
		<a href="#" class="__noti_board _noti_del">
			<div class="noti_item_del __noti_board _noti_del">
				<i class="fa fa-times-circle __noti_board _noti_del"></i>
			</div>
		</a>
		<a href="{=URL}" class="__noti_board _noti_read">
			<div class="noti_board_content __noti_board _noti_read">
				<span class="__noti_board _noti_read">{=CONTENT}</span>
				<span class="bar __noti_board _noti_read">|</span>
				<span class="noti_item_date __noti_board _noti_read">{=DATE}</span>
			</div>
		</a>
	</div>
	
	<!--TPL:SEPARATOR-->
	<div class="_user_info_layer user_info_layer" onclick="event.stopPropagation();event.cancelBubble = true;">
		<h4 class="_user_info_layer_name">{=NAME}</h4>
		<p class="_user_info_layer_tel">{=TEL}</p>
		<p class="_user_info_layer_email">{=EMAIL}</p>
	</div>	

	<!--TPL:SEPARATOR-->
</script>