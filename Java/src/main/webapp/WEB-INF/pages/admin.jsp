<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>Hanchon Print Order System</title>
<link rel="stylesheet" type="text/css" href="/css/index.css">
<c:if test="${company == 'brand1'}">
	<link rel="stylesheet" type="text/css" href="/css/pellongale.css?ver=1">
</c:if>
<%-- <c:if test="${company == 'brand2'}">
	<link rel="stylesheet" type="text/css" href="/css/desperados.css">
</c:if>
<c:if test="${company == 'brand3'}">
	<link rel="stylesheet" type="text/css" href="/css/monteith.css">
</c:if> --%>
<link rel="stylesheet" type="text/css" href="/css/jquery-ui.min.css">
<link rel="stylesheet" type="text/css" href="/css/fa/css/font-awesome.min.css">
<script>
	var htOption = {
		userRoleMap : ${userRoleMap}
		, company : '${company}'
		, orderStatusMap : ${orderStatusMap}
	};
</script>
</head>
<body>
	<input class="_csrf" type="hidden" name="${_csrf.parameterName}"
		value="${_csrf.token}" />
	<div class="wrap _wrap">
		<div class="header">
			<div class="gnb">
<%-- 				<div class="gnb_left">
					<c:if test="${company != 'hojin2world'}">
						<a href="#"  class="change_page _change_homepage" data-tocompany="hojin2world"> 
							<span class="hojin2world _change_homepage_c">브랜드 체인지1</span>
							<span class=" _change_homepage_c">
								
								<i class="fa fa-chevron-right  _change_homepage_c"></i>
							</span>
						</a>
					</c:if>
				

					<c:if test="${company != 'hojin2world2'}">
						<a href="#"  class="change_page _change_homepage" data-tocompany="hojin2world2"> 
							<span class="hojin2world2 _change_homepage_c">브랜드 체인지2</span>
							<span class=" _change_homepage_c">
								
								<i class="fa fa-chevron-right  _change_homepage_c"></i>
							</span>
						</a>
					</c:if>
				</div> --%> <!-- 브랜드 이동을 위한 코드 -->
				<div class="gnb_wrap">
					<a href="#"><span class="role __user_info  _show_user_info">${user.role}</span></a>
					<a href="#"><span class="username __user_info  _show_user_info">${user.username}</span></a>
					<button type="button" class="_logout logout">로그아웃</button>
				</div>
			</div>
			<div class="logo_admin">
				<img class="admin_logo" src="/img/${company}_weblogo.png" ><br />
				<span>A&nbsp;&nbsp;D&nbsp;&nbsp;M&nbsp;&nbsp;I&nbsp;&nbsp;N</span>
			</div>
		</div>
		<div class="main _main">
			<div class="main_side">
				<div class="side_box side_menu _side_menu">
					<ul>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu on"
									data-type="user_role">
									<div class="side_menu_item_bar"></div>
									가입 승인
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu" data-type="user_list">
									<div class="side_menu_item_bar"></div>
									회원 관리
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="product_admin">
									<div class="side_menu_item_bar"></div>
									상품 관리
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="order_comment">
									<div class="side_menu_item_bar"></div>
									댓글 관리
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="oneline_noti">
									<div class="side_menu_item_bar"></div>
									한 줄 공지
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="stats_payment">
									<div class="side_menu_item_bar"></div>
									결제 통계
								</div>
						</a></li>
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="stats_item">
									<div class="side_menu_item_bar"></div>
									품목 통계
								</div>
						</a></li>
						<!-- <li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="stats_team">
									<div class="side_menu_item_bar"></div>
									지역 통계
								</div>
						</a></li> -->  
						<li><a href="#">
								<div class="side_menu_item _nav_topmenu"
									data-type="stats_timelog">
									<div class="side_menu_item_bar"></div>
									타임로그
								</div>
						</a></li>
					</ul>
				</div>
			</div>
			<div class="content _content">
				<jsp:include page="partial/admin/userRole.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/userList.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/oneLineNoti.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/productAdmin.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/statsPayment.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/statsItem.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/statsTeam.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/statsTimelog.jsp" flush="true"></jsp:include>
				<jsp:include page="partial/admin/orderComment.jsp" flush="true"></jsp:include>
			</div>
		</div>
	</div>
	<div class="dimmed_ly _dimmed_ly" style="display: none;"
		onclick="hojin2world.dom.hideLayer();"></div>
	<div class="dimmed_ly spin_ly _spin_ly" style="display: none;">
		<div class="spin_wrap _spin_wrap"></div>
	</div>
	<form method="POST" enctype="multipart/form-data"
		action="/file/upload/product?${_csrf.parameterName}=${_csrf.token}">
		<input type="file" name="file" accept="image/*" id="file_select"
			class="_upload_img_input"
			style="position: absolute; left: -9999999px"
			onchange="hojin2world.fileUploader.showPreviewImage(this);"> <input
			type="hidden" name="backgroundId" />
	</form>
	<form action="/logout" method="POST" id="logoutForm">
		<input class="_csrf" type="hidden" name="${_csrf.parameterName}"
			value="${_csrf.token}" />
	</form>
	<jsp:include page="partial/imageSampleUploadLayer.jsp" flush="true"></jsp:include>
	<script type="text/javascript" src="/js/libs/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="/js/libs/jquery.tmpl.js"></script>
	<script type="text/javascript" src="/js/libs/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/js/libs/jquery.cookie.js"></script>
	<script type="text/javascript" src="/js/libs/json2.js"></script>
	<script type="text/javascript" src="/js/libs/spin.min.js"></script>
	<script type="text/javascript" src="/js/admin/admin.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/ajax.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/utils.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/templates.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/dom.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/fileUploader.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/userRole.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/userList.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/productAdmin.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/oneLineNoti.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/statsPayment.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/statsItem.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/statsTeam.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/statsTimelog.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/admin/orderComment.js?v=${jsv}"></script>
	<script type="text/javascript" src="/js/paging.js?v=${jsv}"></script>
	<script type="text/template" id="template_data">
	<!--TPL:SEPARATOR-->

		<tr class="_norole_user_list_item_tmpl">
			<td>
				<a href="#" class="__user_role _norole_user_id">{=USERID}</a>&nbsp;
			</td>
			<td>
				<a href="#" class="__user_role _norole_user_name">{=USERNAME}</a>&nbsp;
				<button type="button" class="btn3 fa fa-info"></button>
			<td>
				<select name="user_role">
					<option selected>등급을 선택해주세요</option>
					<option value="ADMIN">최고관리자</option>
					<option value="DESIGNER">디자이너</option>
					<option value="BUMA_PM">제작관리</option>
					<option value="BUMA_SALES">관리그룹</option>
					<option value="HOJIN2WORLD_MASTER">HOJIN2WORLD관리자</option>
					<option value="HOJIN2WORLD_SALES">HOJIN2WORLD사원</option>
					<option value="JOIN_WAIT">가입대기</option>
					<option value="OUTSOURCING">외주업체</option>
				</select>
			</td>
			<td><button type="button" class="btn btn2 __user_role _update_role" data-userid="{=USERID}">가입승인<button></td>
		</tr>

	<!--TPL:SEPARATOR-->

	<li class="_product_admin_item">
		<a href="#">
			<div class="product_detail_item _select_item __product_admin" data-id="{=PRODUCT_ID}" data-parentid="{=PRODUCT_PARENT_ID}" product-disabled="{=PRODUCT_DISABLED}">
				{=PRODUCT_NAME}
				<i class="fa fa-chevron-right"></i>
			</div>
		</a>
	</li>

	<!--TPL:SEPARATOR-->

	<div class="_product_admin_range_tmpl">
		범위 <input type="text" class="long" value="{=RANGE}" name="unitprice_range">
		단가 <input type="text" value="{=PRICE}" name="unitprice_by_range" onkeyup="hojin2world.utils.onClickRemoveNonNumber(this);">
		<button type="button" class="btn btn3 remove __product_admin _remove_range">
			<i class="fa fa-minus __product_admin _remove_range"></i> 삭제
		</button>
	</div>

	<!--TPL:SEPARATOR-->

	<div class="_product_admin_price_range_tmpl">
		범위 <input type="text" class="long" value="{=RANGE}" name="price_range">
		가격 <input type="text" value="{=PRICE}" name="price_by_range" onkeyup="hojin2world.utils.onClickRemoveNonNumber(this);">
		<button type="button" class="btn btn3 remove __product_admin _remove_price_range">
			<i class="fa fa-minus __product_admin _remove_price_range"></i> 삭제
		</button>
	</div>

	<!--TPL:SEPARATOR-->

	<tr class="_stats_payment_row">
		<td>{=INDEX}</td>
		<td>{=SEQ}</td>
		<!--<td>{=TEAM}</td>-->
		<td>{=USERNAME}</td>
		<td>{=ITEM}</td>
		<td>{=SHAPE}</td>
		<td>{=PROCESS}</td>		
		<td>{=WIDTH}</td>
		<td>{=HEIGHT}</td>
		<td>{=UNITPRICE}</td>
		<td>{=COUNT}</td>
		<td>{=PRICE}</td>
		<td>{=REGISTERED}</td>
		<td>{=DESIGNED}</td>
		<td>{=PRODUCED}</td>
		<td>{=DELIVERED}</td>
	</tr>

	<!--TPL:SEPARATOR-->
	<tr class="_stats_payment_total_row">
		<td  class="tot_prc" colspan="20">합 계 <span class="_stats_tot_price">{=TOTAL_PRICE}</span> 원</td>
	</tr>

	<!--TPL:SEPARATOR-->

	<tr class="_stats_timelog_row">
		<td>{=INDEX}</td>
		<td>{=SEQ}</td>
		<td>{=USERNAME}</td>
		<td>{=DESIGNER}</td>
		<td>{=REGISTERED}</td>
		<td>{=SAMPLED_FIRST}</td>
		<td>{=SAMPLED_FIRST_PROCESS_TIME}</td>
		<td>{=SAMPLED_FIRST_COMPLIANCE}</td>					
		<td>{=DESIGNED}</td>
		<td>{=DELIVERED}</td>
		<td>{=TOTAL_PROCESS_TIME}</td>
		<td>{=DELIVERED_COMPLIANCE}</td>
		<td>
			<button class="__stats_timelog _show_modify_layer" type="button" data-seq="{=SEQ}">수정</button>
		</td>
	</tr>	

	<!--TPL:SEPARATOR-->

	<tr class="_stats_item_row">
		<td>{=ITEM_NAME}</td>
		<td>{=ORDER_COUNT}</td>
		<td>{=TOTAL_COUNT}</td>		
		<td>{=SALES_COST}</td>
		<!-- <td>{=AVERAGE_COUNT}</td> -->
		<td>{=AVERAGE_COST}</td>
		<td>{=DELIVERY_COMPLIANCE_RATE}</td>
	</tr>

	<!--TPL:SEPARATOR-->

	<tr class="_stats_team_row">
		<td>{=TEAM_NAME}</td>
		<td>{=ORDER_COUNT}</td>
		<td>{=SALES_COST}</td>
		<td>{=AVERAGE_COST}</td>
		<td>{=DESIGN_COMPLIANCE_RATE}</td>
		<td>{=DELIVERY_COMPLIANCE_RATE}</td>
	</tr>

	<!--TPL:SEPARATOR-->

	<tr class="_stats_team_total_row">
		<td><strong>{=TEAM_NAME}</strong></td>
		<td><strong>{=ORDER_COUNT}</strong></td>
		<td><strong>{=SALES_COST}</strong></td>
		<td><strong>{=AVERAGE_COST}</strong></td>
		<td><strong>{=DESIGN_COMPLIANCE_RATE}</strong></td>
		<td><strong>{=DELIVERY_COMPLIANCE_RATE}</strong></td>
	</tr>

	<!--TPL:SEPARATOR-->

	<tr class="_order_comment_row">
		<td>{=USER_NAME}</td>
		<td>{=CONTENT}</td>
		<td>{=REGISTERED}</td>
	</tr>

	<!--TPL:SEPARATOR-->
</script>
	<script type="text/javascript">
	hojin2world.admin.init();
</script>
</body>
</html>