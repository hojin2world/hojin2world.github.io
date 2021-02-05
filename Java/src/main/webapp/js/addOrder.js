
b2b.addOrder = (function(){
	
	var common, templates, ajax, itemLayer, orderList, dom, fileUploader;

	var _setDependecy = function(addOrder) {
		common = b2b.index;
		templates = b2b.templates;
		ajax = b2b.ajax;
		orderList = b2b.orderList;
		dom = b2b.dom;
		fileUploader = b2b.fileUploader;
		
		itemLayer = addOrder.itemLayer;
		itemLayer.init(addOrder);
	};

	var exports = {
		name : 'b2b.addOrder'
	};

	var _element = {}
		, _orderInfoList = []
		, pastCount = 0
		, original = {};
   
	exports.init = function() {
		_setDependecy(this);
		_assignHTML();
		_showFilesizeDesc();
		_checkUploadFilesize();
		_setEvent();
	};
	
	var _setEvent = function(){
		_element['addorder_input'].blur(function(){
			exports.updateUnitprice();
		});
	};
	
	
	
	/*첨부가능 제한 문구 보임*/
	var _showFilesizeDesc = function(){
		$('.f-up-desc').css('display','inline');
	};
	/*파일 용량 체크 이벤트*/
	var _checkUploadFilesize = function(){
		$('._upload_attach_file_input_add_order').change(function(){
			//파일을 선택했다면
			if ($('._upload_attach_file_input_add_order')[0].files.length > 0) {
				$('.f-up-desc').css('display','none');
				
				//20메가가 넘으면 파일을 지우고 파일용량 안내문구를 보임
				if($('._upload_attach_file_input_add_order')[0].files[0].size > 20*1024*1024 ) {
					alert('첨부파일은 20메가를 넘을 수 없습니다');
					$('._upload_attach_file_input_add_order').val('');
					$('._add_odr_attach_file').empty();
					$('.f-up-desc').css('display','inline');
					return false;
				}
			}
			//파일을 선택 안했거나 초기상태 
			else {
				//파일용량 안내문구를 보임
				$('.f-up-desc').css('display','inline');
			}
		});
	};
	
	
	
	var _assignHTML = function() {
		_element.wrap = $('._do_odr');
		_element.pastOrder = $('._past_order_ly');
		_element['add_odr_layer'] = $('._do_odr_input');
		_element['add_odr_item'] =  _element['add_odr_layer'].find('._add_odr_item');
		_element['add_odr_item_code'] = _element['add_odr_layer'].find('._add_odr_item_code');
		_element['add_odr_shape'] = _element['add_odr_layer'].find('._add_odr_shape');
		_element['add_odr_process'] = _element['add_odr_layer'].find('._add_odr_process');
		_element['add_odr_background'] = _element['add_odr_layer'].find('._add_odr_background');
		_element['background_img'] = _element['add_odr_layer'].find('._add_odr_bgrnd_img img');
		_element['width'] = _element['add_odr_layer'].find('._width');
		_element['height'] = _element['add_odr_layer'].find('._height');
		_element['depth'] = _element['add_odr_layer'].find('._depth');
		_element['unitprice'] = _element['add_odr_layer'].find('._unitprice');
		_element['purchaseprice'] = _element['add_odr_layer'].find('._purchaseprice');
		_element['count'] = _element['add_odr_layer'].find('._count');
		_element['total_price'] = _element['add_odr_layer'].find('._total_price');
		_element['total_purchase_price'] = _element['add_odr_layer'].find('._total_purchase_price');
		_element['team_info'] = _element['add_odr_layer'].find('._team_info');
		_element['outlet_detail'] = _element['add_odr_layer'].find('._outlet_detail');
		_element['postcode'] = _element['add_odr_layer'].find('._postcode');
		_element['addr'] = _element['add_odr_layer'].find('._addr');
		_element['detailaddress'] = _element['add_odr_layer'].find('._detailaddress');
		_element['receiver'] = _element['add_odr_layer'].find('._receiver');
		_element['tel'] = _element['add_odr_layer'].find('._tel');
		_element['depositor'] = _element['add_odr_layer'].find('._depositor');
		_element['bill'] = _element['add_odr_layer'].find('._bill');
		_element['business_num'] = _element['add_odr_layer'].find('._business_num');
		_element['business_tel'] = _element['add_odr_layer'].find('._business_tel');
		_element['business_email'] = _element['add_odr_layer'].find('._business_email');
		_element['receipts_tel'] = _element['add_odr_layer'].find('._receipts_tel');
		_element['desc'] = _element['add_odr_layer'].find('._desc');
		_element['past_odr'] = _element['add_odr_layer'].find('._past_odr');
		_element['invoice_info'] = _element['add_odr_layer'].find('.invoice_info');
		_element['invoice_number'] = _element['add_odr_layer'].find('.invoice_number');
		_element['uniquecd'] = _element['add_odr_layer'].find('.uniquecd');
		_element['add_odr_list_box'] = null;
		_element['attach_file_list_box'] = $('._add_odr_attach_file_list');
		_element['addorder_input']  = $('.addorder_input');
	};

	exports.onClick = function(we, welTarget) {
		if (welTarget.hasClass('_same_adrs_add_odr')) {
			_addSameOrderToList();
			we.preventDefault();

		} else if (welTarget.hasClass('_new_adrs_add_odr')) {
			_addNewAddressOrderToList();
			we.preventDefault();

		} else if (welTarget.hasClass('_submit_odr')) {
			_disableSubmitBtn();	//중복submit 방지
			_submitOrder();
			we.preventDefault();
			return false;

		} else if (welTarget.hasClass('_clear_selected_add_order')){
			_clearSelectedAddOrder();

		} else if (welTarget.hasClass('_clear_all_add_order')){
			_clearAllAddOrder();
			
		} else if (welTarget.hasClass('_show_past_odr')) {
			_loadPastOrderList(1);
			
		} else if (welTarget.hasClass('_past_order_title')) {
			_loadPastOrder(welTarget);
			
		} else if (welTarget.hasClass('_past_order_page')) {
			_navigatePastOrderPage(welTarget);
		
		} else if (welTarget.hasClass('_select_attach_file')) {
			_selectAttachFile();
		
		}
		
		itemLayer.onClick(we, welTarget);
	};

	exports.showDoOrder = function() {
		_initAll();
		_removeAddOrderListBox();
		common.hideAllContent();
		_initAttachFile();
		_element['attach_file_list_box'].empty();
		_element.wrap.show();	
		_hide_direct_deliver_elm();
		//_loadUserInfo(); //ok
	};
	
	var _initValue = function() {
		_setUnitprice(0);
		_setPurchaseprice(0);
	};
	
	var _hide_direct_deliver_elm = function() {
		_element['addr'].val('');
		_element['receiver'].val('');
		_element['tel'].val('');
		_element['add_odr_layer'].find('._add_odr_addr').show();
		_element['add_odr_layer'].find('._add_odr_receiver').show();
		_element['add_odr_layer'].find('._add_odr_tel').show();
	};

	exports.validateNumInput = function(elTarget) {
		_removeNonNumber(elTarget);
		sValue = elTarget.value;
	};

	var _removeNonNumber = function(elTarget) {
		var str = elTarget.value;
		elTarget.value = b2b.utils.removeNonNumber(str);
	};
	

	exports.updateTotalPrice = function(countElem) {
		countElem = countElem || _element['count'][0];
		var priceType = itemLayer.getProductInfo('price_type')
			, count = $.trim(countElem.value) || 0
			, unitprice = _element['unitprice'].attr('data-price') || 0
			, purchaseprice = _element['purchaseprice'].attr('data-purchaseprice') || 0
			, totalPrice
			, totalPurchasePrice;
		
		if (priceType === 'unitprice') {
			totalPrice = count * unitprice;
			totalPurchasePrice = count * purchaseprice
			
		} else if (priceType === 'unit') {			
			totalPrice = _getTotalPriceByRange(count);
		}
		
		_setDataToElem(_element['total_price'], totalPrice);
		_setDataToElem(_element['total_purchase_price'], totalPurchasePrice);
	};
	//수량을 입력하면 단가를 조정함
	exports.updateUnitprice = function() {
		var unitpriceType = itemLayer.getProductInfo('unitprice_type')
			, minPrice = itemLayer.getProductInfo('unitprice_min')
			, width, height, depth, unitprice ,purchaseprice; //매입가

		if (unitpriceType === 'fix') {
			return;
		}
		
		width = ($.trim(_element['width'].val()) - 0) || 0;
		height = ($.trim(_element['height'].val()) - 0) || 0;
		depth = ($.trim(_element['depth'].val()) - 0) || 0;
		count = ($.trim(_element['count'].val()) - 0) || 0;
		
		if (unitpriceType === 'formula') {
			unitpriceFormula = itemLayer.getProductInfo('unitprice_formula');
			unitprice = (eval(unitpriceFormula));
			
		} else if (unitpriceType === 'range') {
			unitprice = _getUnitpriceByRange(width, height, depth);
		}
		
		unitprice = Math.floor(unitprice);//소수점 절삭
		purchaseprice = Math.floor(purchaseprice);//소수점 절삭
		
		if (unitprice < minPrice) {
			unitprice = minPrice;
		}
		
		_setUnitprice(unitprice);
		_setPurchaseprice(purchaseprice); //매입가
		exports.updateTotalPrice();
	};
	
	//규격의 range로 구하는 단가
	var _getUnitpriceByRange = function(width, height, depth) {
		var rangeList = itemLayer.getProductInfo('unitprice_range')
			, rangeObj;
		var unitprice=0;
		for (var i = 0, length = rangeList.length; i < length; i++) {			
			rangeObj = rangeList[i];
			if (eval(rangeObj.range)) {
				unitprice = rangeObj.price;
			}
		}
		
		return unitprice;
	};
	
	var _getTotalPriceByRange = function(count) {
		var rangeList = itemLayer.getProductInfo('price_range')
			, rangeObj;
		var total_price = 0;
		for (var i = 0, length = rangeList.length; i < length; i++) {			
			rangeObj = rangeList[i];
			if (eval(rangeObj.range)) {
				total_price = rangeObj.price;
			}
		}
		
		return total_price;
	};

	var _setDataToElem = function(el, value) {
		$(el).html(value)
			.val(value)
			.data('value', value);
	};
	
	var _addSameOrderToList = function() {
		_addOrderToList();
	};

	var _addNewAddressOrderToList = function() {
		if (_addOrderToList()) {
			_initAll();
			_showFilesizeDesc();
		}		
	};
	
	var _addOrderToList = function() {
		var orderInfo = _getOrderDataAndValidate();

		if (!orderInfo) {
			return false;
		}
		
		orderInfo.company = htOption.company;
		_orderInfoList.push(orderInfo);
		_showOdrToAddListBox();
		_appendOdrToAddListItem(orderInfo);
		_appendAttachFileToArea();
		_showFilesizeDesc();
		return true;
	};

	var _hideOrderList = function() {
		_element['add_odr_list'].remove();
		_element['add_odr_list'] = null;
	};
	
	
	var getTime = function() {
		  var date = new Date();
		  var fullDate =
		    leadingZeros(date.getFullYear(), 4) +
		    leadingZeros(date.getMonth() + 1, 2) +
		    leadingZeros(date.getDate(), 2) +

		    leadingZeros(date.getHours(), 2) +
		    leadingZeros(date.getMinutes(), 2) +
		    leadingZeros(date.getSeconds(), 2);

		  return fullDate;
	};
	
	var leadingZeros= function(n, digits) {
		  var zero = '';
		  n = n.toString();

		  if (n.length < digits) {
		    for (i = 0; i < digits - n.length; i++)
		      zero += '0';
		  }
		  return zero + n;
		}	

	var _submitOrder = function() {
		if (_orderInfoList && _orderInfoList.length > 0) {
			_submitMultiOrder();
			return;
		}
		//validation
		var orderInfo = _getOrderDataAndValidate();
		if (!orderInfo) {
			_enableSubmitBtn(); //전송가능 상태로 변경
			return;
		}
	
		ajax.request('/order/submit', orderInfo,  function(response) {
			/*var result = response.result;*/ //origin
			var result = response;//수정
			/*if (!result.success) {*/ //origin
			if (!result) {//수정
				alert('전송이 실패하였습니다.');
				_enableSubmitBtn(); 
				return;
			}
			var returnValue = result.returnValue
			, seq = returnValue.seq , id = returnValue.id;
			
			document.getElementsByName("goodFlowId").value=id;
			
			fileUploader.uploadForAddOrder(seq); //파일업로드
			alert('주문이 등록되었습니다.');
			
			_updateMonthlyOrder();
			//주문 목록 리스팅
			orderList.callToGetAllOrder();
			
			_showFilesizeDesc(); //파일업로드 문구 보이기
			
			_enableSubmitBtn(); //전송가능 상태로 변경
			
		
		}, 'POST');
		
	};
	

	//전송가능 
	var _enableSubmitBtn = function(){
		$(".btn.do_odr_ok.__add_odr").addClass('_submit_odr').text('주문 완료');
	};
	//전송 비가능 
	var _disableSubmitBtn = function(){
		//중복클릭방지 설정
		$(".btn.do_odr_ok.__add_odr").removeClass('_submit_odr').text('전송중..')
	};
	
	var _updateMonthlyOrder = function() {
		ajax.request('/order/getMonthlyOrder', null, function(response){
			/*result = response.result;*/ //origin
			result = response; //수정
			/*monthlyOrder = result.returnValue;*/ //origin
			monthlyOrder = result;//수정
			
			$('._monthly_month').html(monthlyOrder.month);
			$('._monthly_now').html(monthlyOrder.nowOrderCount);
			$('._monthly_done').html(monthlyOrder.doneOrderCount);
			$('._monthly_total').html(monthlyOrder.totalOrderCount);
			$('._monthly_price').html(monthlyOrder.totalPrice);			
		});
	};

	//외주업체 단가를 계산 하는 함수
	var _calcUnitPriceGeorise = function(){
		
		//타입을 받고
		var unitprice_georise_type = itemLayer.getProductInfo('unitprice_georise_type');
		var unitpriceGeorise = 0;	//외주업체 단가 초기화
		
		//계산식이다
		if (unitprice_georise_type === 'formula') {
			//width, height, count 불러옴 
			width = (_getSizeValue('width') -0) || 0;
			height =(_getSizeValue('height')-0) || 0;
			depth = (_getSizeValue('depth') -0) || 0;		
			count = ($.trim(_element['count'].val()) - 0) || 0;
			
			//계산식 수행
			unitpriceGeoriseFormula = itemLayer.getProductInfo('unitprice_georise_formula');
			unitpriceGeorise = (eval(unitpriceGeoriseFormula));
		}
		//고정값이다
		else if(unitprice_georise_type === 'fix') {
			//고정값 입력
			unitpriceGeorise = itemLayer.getProductInfo('unitprice_georise');
		}
		unitpriceGeorise = Math.floor(unitpriceGeorise); 	//소수점 제거
		return unitpriceGeorise;
	};
	

	
	
	
	var _getOrderDataAndValidate = function() {
		var tel = $.trim(_element['tel'].val());
		tel = tel.replace("-","");
		var bill = $('input[name="dlvr"]:checked').val();
		var item = $.trim(_element['add_odr_item'].html())
			, item_code = $.trim(_element['add_odr_item_code'].html())
			, shape = $.trim(_element['add_odr_shape'].html())
			, process = $.trim(_element['add_odr_process'].html())
			, background = $.trim(_element['add_odr_background'].html())
			, backgroundId = _element['add_odr_background'].attr('data-id')
			, purchasePrice = $.trim(_element['purchaseprice'].html())
			, unitPrice = $.trim(_element['unitprice'].html())
			, width
			, height
			, depth
			, count = $.trim(_element['count'].val())
			, price = $.trim(_element['total_price'].val())
			, purchase_price = $.trim(_element['total_purchase_price'].val())
			, teaminfo = $.trim(_element['team_info'].val())
			, outletDetail = $.trim(_element['outlet_detail'].val())
			, postcode = $.trim(_element['postcode'].val())
			, addr = $.trim(_element['addr'].val())
			, detailaddress = $.trim(_element['detailaddress'].val())
			, receiver = $.trim(_element['receiver'].val())
			, tel = $.trim(_element['tel'].val().replace(/-/gi,"").replace(/ /gi,"").replace(/  /gi,""))
			, depositor = $.trim(_element['depositor'].val())
			, bill = bill
			, business_num = $.trim(_element['business_num'].val())
			, business_tel = $.trim(_element['business_tel'].val())
			, business_email = $.trim(_element['business_email'].val())
			, receipts_tel = $.trim(_element['receipts_tel'].val())
			, desc = $.trim(_element['desc'].val())
//			, unitpriceGeorise = itemLayer.getProductInfo('unitprice_georise')
			, unitpriceGeorise = _calcUnitPriceGeorise()
			, pastOdr = _element['past_odr'].html()
			, invoice_info = $.trim(_element['invoice_info'].val())
			, invoice_number = $.trim(_element['invoice_number'].val())
			, uniquecd = $.trim(_element['uniquecd'].val());
		desc = desc.replace(/\n/gi, '<br>');
		
		if (unitpriceGeorise === '' || unitpriceGeorise === null) {
			unitpriceGeorise = 0;
		}
		
		width = _getSizeValue('width');
		height = _getSizeValue('height');
		depth = _getSizeValue('depth');		
		
		//값이 없거나 숫자가 아닐때
//		if (isNaN(width) || width == '') {			
//			alert('가로를 입력해주세요.');
//			return;
//		}
//		if (isNaN(height) || height == '') {			
//			alert('세로를 입력해주세요.');
//			return;
//		}
//		if (isNaN(depth) || depth == '') {			
//			alert('깊이를 입력해주세요.');
//			return;
//		}
		if (!item || !shape || !process || !background) {
			alert('모든 항목을 입력(선택)해주세요.');
			return;
		}

		if (!count) {
			alert('수량을 입력해주세요');
			return;
		}

		if (!price) {
			alert('수량 및 가격을 입력해주세요');
			return;
		}
		if (!outletDetail) {
			alert('매장명을 입력해주세요');
			return;
		}

		/*if (!teaminfo) {
			alert('지역을 입력해주세요');
			return;
		}*/

//		if (!outlet) {
//			alert('업장 타입을 입력해주세요');
//			return;
//		} 
		
		
		
		/*if(_checkDelivery() === 'store') {*/
			var telLength = $.trim(_element['tel'].val()).length;
			var addrLength = $.trim(_element['addr'].val()).length;
			var telExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;

			if (!addr) {
				alert('주소를 입력해 주세요.');
				return;
			}
			if (addrLength<=10) {
				alert('주소를 10자리 이상 입력해 주세요.');
				return;
			}
			if (!receiver) {
				alert('수취인명을 입력해 주세요.');
				return;
			}
			if(telLength < 10){
				alert("-를 제외한 정확한 번호를 입력해 주세요.(010을 포함한 10-11자리)");
				return ;
			}
			if (!tel) {
				alert('전화번호를 입력해 주세요.');
				return;
			}
		/*}*/
		
		return {
			item :  item
			, item_code : item_code
			, shape : shape
			, process : process
			, background : background
			, background_id : backgroundId
			, width : width || 0
			, height : height || 0
			, depth : depth || 0
			, unitprice : unitPrice || 0
			, purchaseprice : purchasePrice || 0
			, count : count
			, price : price
			, purchase_price : purchase_price
			, sender_postcode : postcode
			, sender_address : addr
			, sender_detailaddress : detailaddress
			, sender_name : receiver
			, sender_phone : tel
			, depositor : depositor
			, bill : bill
			, business_num : business_num
			, business_tel : business_tel
			, business_email : business_email
			, receipts_tel : receipts_tel
			, team : teaminfo
			, outlet_detail : outletDetail
			, description : desc
			, unitprice_georise : unitpriceGeorise
			, past_odr: pastOdr
			, invoice_info : invoice_info
			, invoice_number : invoice_number
			, uniquecd : uniquecd
		};
	};
	
	document.getElementsByName("goodFlowId").value=_getOrderDataAndValidate;
	//계산서발행 라디오박스
	var _checkDelivery = function() {
		var dlvr = document.getElementsByName('dlvr')
			, value;
		if (dlvr[0].checked) {
			value = '세금계산서';
			return value;
		}
		
		if (dlvr[1].checked) {
			value = '현금영수증';
			return value;
		}
	}
	
	var _getSizeValue = function(size) {
		var sizeType = itemLayer.getProductInfo(size + '_type');
		
		if (sizeType === 'input') {
			return $.trim(_element[size].val());
			
		} else if (sizeType === 'fix') {
			return _element['add_odr_layer']
				.find('._add_order_' + size + '._' + sizeType)
				.html();
		}
		
		return null;
	};	

	var _showOdrToAddListBox = function() {
		if (_element['add_odr_list_box']) {
			return;
		}

		var templateStr = templates.get('_add_odr_lst_box');
		_element['add_odr_list_box'] = $(templateStr);
		_element['add_odr_layer'].after(_element['add_odr_list_box']);
	};

	var _hideOdrToAddListBox = function() {
		_element['add_odr_list_box'].remove();
		_element['add_odr_list_box'] = null;
	};

	var _appendOdrToAddListItem = function(orderInfo) {
		if (!orderInfo) {
			return;
		}		
		
		var	priceTr = _element['add_odr_list_box'].find('._prc_tot') 
			, templateStr = templates.get('_add_odr_lst_item', 'text')
							.replace('{=IMG}', '')
							.replace('{=TITLE}', orderList.getTitle(orderInfo))
							.replace('{=PURCHASEPRICE}', orderInfo.purchaseprice)
							.replace('{=UNITPRICE}', orderInfo.unitprice)
							.replace('{=COUNT}', orderInfo.count)
							.replace('{=PURCHASE_PRICE}', orderInfo.purchase_price)
							.replace('{=PRICE}', orderInfo.price)
							.replace('{=INDEX}', _orderInfoList.length - 1);		
		
		priceTr.before($(templateStr));
		priceTr.find('._total').html(_getTotalPrice());
	};

	var _getTotalPrice = function() {
		var totalPrice = 0;

		for (var i = 0, length = _orderInfoList.length; i < length; i++) {
			totalPrice += (_orderInfoList[i].price - 0);
		}
		
		return totalPrice;
	};

	exports.getElement = function(key) {
		return _element[key];
	};
	
	/*여러개 주문 submit*/
	var _submitMultiOrder = function() {
		ajax.request('order/submit/multi', JSON.stringify(_orderInfoList), function(response) {
			/*var result = response.result;*/ //origin
			var result = response//수정
			/*if (!result.success) {*/ //origin
			if (!result) {
				alert('오류가 발생했습니다.');
				return;
			}
			
			var returnValue = result.returnValue
				, seqList = returnValue.seqList;
			_uploadAttachFileMulti(seqList);
				
			alert(_orderInfoList.length + '개의 주문이 등록되었습니다.');
			orderList.callToGetAllOrder();
			_enableSubmitBtn();
			
		}, 'POST');
	};

	var _clearAllAddOrder = function() {
		_orderInfoList = [];
		_hideOdrToAddListBox();
		_element['attach_file_list_box'].empty();
	};

	var _clearSelectedAddOrder = function() {
		var checkbox = _element['add_odr_list_box'].find('input[type=checkbox]')
			, checkedList = []
			, indexList = []
			, newOrderInfoList = [];

		for (var i = 0, length = checkbox.length; i < length; i++) {
			if (checkbox[i].checked) {
				checkedList.push(checkbox[i]);
				_removeAttachFileFromList(i);
			} else {
				indexList.push(i);
			}
		}

		for (var i = 0, length = indexList.length; i < length; i++) {
			newOrderInfoList.push(_orderInfoList[indexList[i]]);
		}

		_orderInfoList = newOrderInfoList;

		for (var i = 0, length = checkedList.length; i < length; i++) {
			$(checkedList[i]).parent().parent().remove();
		}
	};
	
	var _setUnitprice = function(unitprice ) {
		unitprice = unitprice || 0;
		_element['unitprice']
			.attr('data-price', unitprice)
			.html(unitprice)
	};
	
	var _setPurchaseprice = function(purchaseprice ) {
		purchaseprice = purchaseprice || 0;
		_element['purchaseprice']
			.attr('data-purchaseprice', purchaseprice)
			.html(purchaseprice)
	};
	/*
	exports.showDetailTypeElem = function(key, type) {
		if (!key) {
			return;
		}

		if (key === 'unitprice') {
			return;
		}
		
		var elementList = _element.wrap.find('._add_order_' + key);
		elementList.hide();
		elementList.filter(function(index, element) {
			element = $(element);
			if (element.hasClass('_' + type)) {
				element.show();
			}
		});
	};*/
	
	exports.showDetailTypeElem = function(key, type) {
		if (!key) {
			return;
		}

		if (key === 'unitprice') {
			return;
		}
		

		if (key === 'purchaseprice') {
			return;
		}
		
		var sizeElemList = _element['add_odr_layer'].find('._add_order_' + key);
		sizeElemList.hide();		
		sizeElemList.filter(function(index, element) {			
			element = $(element);
			if (element.hasClass('_' + type)) {				
				var inner = '';
				if(type === 'unable'){
					if(key === 'width'){
						inner = '<span class="_add_order_'+type+' _unable">입력불가(가로)</span>';
					} else if (key === 'height') {
						inner = '<span class="_add_order_'+type+' _unable">입력불가(세로)</span>';
					} else if (key === 'depth') {
						inner = '<span class="_add_order_'+type+' _unable">입력불가(깊이)</span>';
					}
					element.html(inner);
					
				} else if (type === 'input') {
					$(element).find('input').val('');
				}
				
				element.show();
			}
		});
	};
	
	exports.setAndInitDetailFixValue = function(key, value) {
		if (key === 'unitprice') {
			_setUnitprice(value);
			return;
		}
		
		if (key === 'purchaseprice') {
			_setPurchaseprice(value);
			return;
		}
				
		_element.wrap.find('._fix._add_order_' + key)
			.html(value);
	};
	
	exports.setCountToOne = function() {
		_element['count'].val(1);
		exports.updateTotalPrice(_element['count'][0]);
	};
	//원본 코드
/*	exports.showDeliveryInfo = function(elTarget) {
		welTarget = $(elTarget);
		if(welTarget.val() ===  'branch'){
			_element['postcode'].val('');
			_element['addr'].val('');
			_element['detailaddress'].val('');
			_element['receiver'].val('');
			_element['tel'].val('');
			_element['add_odr_layer'].find('._add_odr_addr').hide();
			_element['add_odr_layer'].find('._add_odr_receiver').hide();
			_element['add_odr_layer'].find('._add_odr_tel').hide();
			_element['add_odr_layer'].find('._team_info').show();
			
		} else {
			_element['add_odr_layer'].find('._add_odr_addr').show();
			_element['add_odr_layer'].find('._add_odr_receiver').show();
			_element['add_odr_layer'].find('._add_odr_tel').show();
			_element['add_odr_layer'].find('._team_info').hide();
		}
	};*/
	//계산서 발행 라디오박스
	exports.showBillInfo = function(elTarget) {
		welTarget = $(elTarget);
		if(welTarget.val() ===  '세금계산서'){
			_element['add_odr_layer'].find('._add_odr_receipts_tel').hide();
			_element['add_odr_layer'].find('._add_odr_business').show();
			_element['add_odr_layer'].find('._business_num').show();
			_element['add_odr_layer'].find('._business_tel').show();
			_element['add_odr_layer'].find('._business_email').show();
		}else {
			_element['add_odr_layer'].find('._add_odr_receipts_tel').show();
			_element['add_odr_layer'].find('._add_odr_business').hide();
			_element['add_odr_layer'].find('._business_num').hide();
			_element['add_odr_layer'].find('._business_tel').hide();
			_element['add_odr_layer'].find('._business_email').hide();
		}
	};
	
	exports.setBackgroundId = function(id) {
		_element['add_odr_background'].attr('data-id', id);
		_element['background_img'].attr('src', '/file/download/product?id=' + id)
			.show();		
	};
	
	var _loadPastOrderList = function(pastOrderListPage) {
		var title = ''
			, date = ''
			, pastOrderHTML = ''
			, pastOrderListHTML = '';
		
		ajax.request('/order/loadPastOrderList/' + pastOrderListPage, null, function(response){
			/*result = response.result;*/ //origin
			result = response;
			
			/*var pastOrderList = result.returnValue.pastOrderList
				, lastPage = result.returnValue.lastPage;*/ //origin
			
			var pastOrderList = result.returnValue.pastOrderList
			, lastPage = result.returnValue.lastPage; //수정
			
			for (var i = 0; i < pastOrderList.length; i++) {
				var pastOrder = pastOrderList[i];
				title = orderList.getTitle(pastOrder);
				date = pastOrder.registered;
				seq = pastOrder.seq;
				
				pastOrderHTML = '<tr><td>' +
								'<a href ="#" class="__add_odr _past_order_title" data-pastseq="'+ seq +'">' + title +
								'</a></td>' + 
								'<td>' + date + '</td><tr>';
				pastOrderListHTML += pastOrderHTML;
			}
			
			_element.pastOrder.find('._past_order_list').html(pastOrderListHTML);
			_makePastOrderPage(pastOrderListPage, lastPage);
			_showPastOrder();
		});
	};
	
	var _makePastOrderPage = function(pastOrderListPage, lastPage) {
		_element.pastOrder.find('._page_area').find('._current_page').html(pastOrderListPage);
		_element.pastOrder.find('._page_area').find('._total_page').html(lastPage)
	};
	
	var _navigatePastOrderPage = function(welTarget) {
		var page = _element.pastOrder.find('._page_area').find('._current_page').html();
		
		if (welTarget.hasClass('_prev')) {
			if (page > 1) {
				page = page - 1;
				
			} else {
				alert('첫번째 페이지 입니다.');
				return;
			}
		} else if(welTarget.hasClass('_next')) {
			lastPage = _element.pastOrder.find('._page_area').find('._total_page').html();
			
			if (page < lastPage) {
				page = (page * 1) + 1;
				
			} else if (page === lastPage) {
				alert("마지막 페이지 입니다.");
				return;
			}
		}
		
		_loadPastOrderList(page);		
	};
	
	var _showPastOrder = function() {		
		_element.pastOrder.show();
		dom.showLayer(_element.pastOrder);
	};
	
	exports.hidePastOrderLayer = function() {
		common.hideDimmedLayer();
		_element.pastOrder.hide();
	};
	
	var _loadPastOrder = function(welTarget) {
		var orderSeq = welTarget.attr('data-pastseq');
		exports.hidePastOrderLayer();	
		_callToloadPastOrder(orderSeq);
	};
	
	exports.reorder = function(orderSeq, callback) {		
		if (!orderSeq) {
			return;
		}
		
		_element.wrap.show();
		_callToloadPastOrder(orderSeq, callback);
	};
	
	//이전주문 불러오기(이거 조지기 )
	var _callToloadPastOrder = function(seq, callback) {
		ajax.request('/order/loadPastOrder/' + seq, null, function(response){
			/*var result = response.result
				, order = result.returnValue;*/ //origin
			
			var result = response
			, order = result.returnValue; //수정
			
			itemLayer.callToSetProductInfoByOrderInfo(order, $.proxy(_fillOrderData, this, order));			
			_element['background_img'].show();
			
			if (typeof callback === 'function') {
				callback();
			}
		});
	};
	
	var _fillOrderData = function(order){//userInfo {
		_element['add_odr_item'].html(order.item);
		_element['add_odr_item_code'].html(order.item_code);
		_element['add_odr_shape'].html(order.shape);
		_element['add_odr_process'].html(order.process);
		_element['add_odr_background'].html(order.background);
		_element['add_odr_background'].attr('data-id', order.background_id);
		_element['background_img'].attr('src','/file/download/product?id=' + order.background_id);
				
		_element['add_odr_layer'].find('._unable_width').html('입력불가(가로)');
		_element['add_odr_layer'].find('._fix_width').html(order.width || '');
		_element['add_odr_layer'].find('._input_width ._width').val(order.width || '');
		
		_element['add_odr_layer'].find('._unable_height').html('입력불가(세로)');
		_element['add_odr_layer'].find('._fix_height').html(order.height || '');
		_element['add_odr_layer'].find('._input_height ._height').val(order.height || '');
		
		_element['add_odr_layer'].find('._unable_depth').html('입력불가(깊이)');
		_element['add_odr_layer'].find('._fix_depth').html(order.depth || '');
		_element['add_odr_layer'].find('._input_depth ._depth').val(order.depth || '');		
		
		_element['unitprice'].html(order.unitprice);
		_element['unitprice'].attr('data-price', order.unitprice);
		_element['unitprice'].data('price', order.unitprice);// 단가
		_element['purchaseprice'].html(order.purchaseprice);// 단가 합계
		_element['purchaseprice'].attr('data-purchaseprice', order.purchaseprice); // 매입가
		_element['purchaseprice'].data('purchaseprice', order.purchaseprice); //매입가 합계
		_element['count'].val(order.count);
		_element['total_price'].val(order.price);
		_element['total_price'].text(order.price);
		_element['total_purchase_price'].val(order.purchase_price);
		_element['total_purchase_price'].text(order.purchase_price);
		_element['team_info'].val(order.team);
		_element['outlet_detail'].val(order.outlet_detail);
		_element['postcode'].val(order.sender_postcode);
		_element['addr'].val(order.sender_address);
		_element['detailaddress'].val(order.sender_detailaddress);
		_element['receiver'].val(order.sender_name);
		_element['tel'].val((order.sender_phone).split("-"));
		_element['depositor'].val(order.depositor);
		_element['bill'].val(order.bill);//계산서 발행 유무
		_element['business_num'].val(order.business_num);
		_element['business_tel'].val(order.business_tel);
		_element['business_email'].val(order.business_email);
		_element['receipts_tel'].val(order.receipts_tel);
		/*_element['tel'].val(order.sender_phone);*/
		_element['desc'].val(order.description.replace(/<br\s?\/?>/g, '\n'));
		_element['invoice_info'].val(order.invoice_info);
		_element['invoice_number'].val(order.invoice_number);
		_element['uniquecd'].val(order.uniquecd);
		_element['background_img'].attr('src', '/file/download/product?id=' + order.background_id);
		
		original.width = order.width;
		original.height = order.height;
		original.depth = order.depth;
		
		if(order.sender_address || order.sender_name || order.sender_phone) {
			$("input:radio[name='dlvr']:radio[value='세금계산서']").prop("checked", true);
			_element['add_odr_layer'].find('._add_odr_buisness').show();
			_element['add_odr_layer'].find('.buisness_num').show();
			_element['add_odr_layer'].find('.buisness_tel').show();
			_element['add_odr_layer'].find('.buisness_email').show();
		} else {
			$("input:radio[name='dlvr']:radio[value='현금영수증']").prop("checked", true);
/*			_element['add_odr_layer'].find('._add_odr_addr').show();
			_element['add_odr_layer'].find('._add_odr_receiver').show();
			_element['add_odr_layer'].find('._add_odr_tel').show();
			_element['add_odr_layer'].find('._team_info').show();*/
			_element['add_odr_layer'].find('._add_odr_receipts_tel').show();//현금영수증
			_element['add_odr_layer'].find('._add_odr_buisness').hide();
		}
		
		if (order.seq) {
			_element['past_odr'].html(order.seq);
			_element['past_odr'].show();
		}
		
		_element['background_img'].show();
	};
	
	var _initAll = function() {
		_element['add_odr_item_code'].html('');
		_element['add_odr_item'].html('');
		_element['add_odr_shape'].html('');
		_element['add_odr_process'].html('');
		_element['add_odr_background'].html('');
		_element['add_odr_background'].attr('data-id','');
		_element['background_img'].attr('src', '/img/product_default_img_b2b.png');
		_element['add_odr_layer'].find('._unable_width').html('입력불가(가로)');
		_element['add_odr_layer'].find('._fix_width').html('');
		_element['add_odr_layer'].find('._input_width ._width').val('');
		_element['add_odr_layer'].find('._unable_height').html('입력불가(세로)');
		_element['add_odr_layer'].find('._fix_height').html('');
		_element['add_odr_layer'].find('._input_height ._height').val('');
		_element['add_odr_layer'].find('._unable_depth').html('입력불가(깊이)');
		_element['add_odr_layer'].find('._fix_depth').html('');
		_element['add_odr_layer'].find('._input_depth .depth').val('');
		_element['unitprice'].html('0');
		_element['unitprice'].attr('data-price', 0);
		_element['purchaseprice'].html('0');
		_element['purchaseprice'].attr('data-purchaseprice', 0);
		_element['count'].val('');
		_element['total_price'].val('');
		_element['total_purchase_price'].val('');
		_element['team_info'].val('');
		_element['outlet_detail'].val('');
		_element['postcode'].val('');
		_element['addr'].val('');
		_element['detailaddress'].val('');
		_element['receiver'].val('');
		_element['tel'].val('');
		_element['depositor'].val('');
		_element['bill'].val('');
		_element['business_num'].val('');
		_element['business_tel'].val('');
		_element['business_email'].val('');
		_element['receipts_tel'].val('');
		_element['desc'].val('');
		_element['past_odr'].val('').hide();	
		_element['invoice_info'].val('');
		_element['invoice_number'].val('');
		_element['uniquecd'].val('');
		
		$("input:radio[name='dlvr']:radio[value='세금계산서']").prop("checked", true);
		
		itemLayer.initCurrentProductInfo();
	};
	
	var _removeAddOrderListBox = function() {
		_orderInfoList = [];
		
		if (_element['add_odr_list_box']) {
			_element['add_odr_list_box'].remove();
			_element['add_odr_list_box'] = null;
		}
	};
	
	var _selectAttachFile = function() {
		$('._upload_attach_file_input_add_order').trigger('click');
	};
	
	exports.showAttachFileArea = function(fileInput) {
		var path = fileInput.value
			, splitPath = path.split('\\')
			, filename = splitPath[splitPath.length - 1];
		
		$('._add_odr_attach_file_area').find('span').html(filename);
		$('._add_odr_attach_file_area').show();
	};
	
	var _initAttachFile = function() {
		$('._add_odr_attach_file_area').find('span').html('');
		$('._add_odr_attach_file_area').hide();
		fileUploader.initAttachFileAddOrder();		
	};	
	
	var _appendAttachFileToArea = function() {
		var original = $('#attach_file_select_add_order')
			, clone = original.clone(true);
		
		clone.insertAfter(original);
		clone.val('');
		original.appendTo(_element['attach_file_list_box']);
		original.removeClass('_upload_attach_file_input_add_order');
		original.attr('id', '');
		_initAttachFile();
	};
	
	var _uploadAttachFileMulti = function(seqList) {
		var fileInputList =_element['attach_file_list_box'].children()
			, fileInput;
		
		for (var i = 0, length = seqList.length; i < length; i++) {			
			fileInput = fileInputList[i];
			if (fileInput.value) {
				_setAttachFileToFormFromMulti($(fileInput));
				fileUploader.uploadForAddOrderMulti(seqList[i]);
			}
		}
	};
	
	var _setAttachFileToFormFromMulti = function(fileInput) {
		var form = $('._attach_file_select_add_order_from_multi_form')
			, fileDummy = form.find('input[type=file]');
		
		fileDummy.insertAfter(fileInput);
		fileInput.appendTo(form);
	};
	
	var _removeAttachFileFromList = function(index) {
		var list = $('._add_odr_attach_file_list').children();
		$(list[index]).remove();
	};
	
	
	

	return exports;
})();