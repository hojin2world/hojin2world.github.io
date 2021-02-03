hojin2world.stat = (function(){
	var common, ajax, templates, utils ,addOrder;

	var _setDependency = function() {
		common = hojin2world.index;
		ajax = hojin2world.ajax;
		templates = hojin2world.templates;
		utils = hojin2world.utils;
	};

	var exports = {
		name : 'hojin2world.stat'
	};

	var _element = {}
		, _dataType = 'order';

	exports.init = function() {
		_setDependency();
		_assignHTML();
		_initCalendar();
	};
	
	exports.show = function() {
		_initSearchOption();
		_element.container.show();
		_checkValid();
	};

	exports.onClick = function(we, welTarget) {
		if (welTarget.hasClass('_search')) {
			_callToGetStatResult();
			/*_test();*/
			we.preventDefault();
			
			
		}else if (welTarget.hasClass('_change_stat_type')) {
			_changeStatType(welTarget);
			we.preventDefault();
		}else if (welTarget.hasClass('_dataType')) {
			_checkValid();
			we.preventDefault();
		}
	};
	/*송장출력 폼 데이터 넘기기*/
	
/*	var form = document.querySelector('.invoiceForm'),
    target = form.target,
    features = 'width=660, height=600, toolbar=no, top=10, status=no, scrollbars=no, resizable=yes, location=no';

		document.querySelector('._invoicePrint').addEventListener('click', function () {
		    window.open('', target, features);
		    form.submit();
	});*/
	
	/*송장 현재 사용 X*/
	

	
	var _assignHTML = function() {
		_element.container = $('._odr_stat');
		_element.searchopt = _element.container.find('._search_opt_tbl');
		_element.customeropt = _element.searchopt.find('._customer_opt');
		_element.itemopt = _element.searchopt.find('._item_opt');
		_element.statopt = _element.searchopt.find('._stat_opt');
		_element.teamopt = _element.searchopt.find('._team_opt');
		_element.channelopt = _element.searchopt.find('._channel_opt');
		_element.outletopt = _element.searchopt.find('._outlet_opt');
		_element.fromDate = _element.container.find('._stat_date_from');
		_element.toDate = _element.container.find('._stat_date_to');
		_element.isUnitZero = $('._unit_zero');
		_element.isPriceZero = $('._price_zero');
		_element.statResultArea = $('._stat_result_area');
		_element.statResultList = $('._stat_result_list');
		_element.btnArea = _element.container.find('._stat_btn_area');
		_element.btnExcel = _element.container.find('._btnExcel'); //엑셀 버튼
		//_element.invoicePrint = _element.container.find('._invoicePrint');
		//_element.invoicePrint = _element.container.find('._generateId');
	};
	


	
	//id발급 , 송장출력 버튼 안보이게 처리 
	var _checkValid = function() {
		ajax.request('/order/validCheck/detailForMaster', null, function(response){
			result = response;
			//result = response.result; //origin
			//var valid = result.returnValue; //origin
			var valid = result.returnValue;
			
			if (valid === 'hideAll') {
				//_element.container.find('._invoicePrint').hide();   //송장사용시 주석해제
				//_element.container.find('._generateId').hide();  //송장사용시 주석해제
				_element.container.find('._btnExcel').hide();
			} else if (valid === 'hideModAndCancel') {
				//_element.container.find('._invoicePrint').show();	 //송장사용시 주석해제
				//_element.container.find('._generateId').show(); //송장사용시 주석해제
				_element.container.find('._btnExcel').show();
			} else if (valid === 'hideCancel') {
				//_element.container.find('._invoicePrint').show();	 //송장사용시 주석해제
				//_element.container.find('._generateId').show(); //송장사용시 주석해제
				_element.container.find('._btnExcel').show();
			}  else if (valid === 'hideSomethingAll') {
				//_element.container.find('._invoicePrint').show();	//송장사용시 주석해제
				//_element.container.find('._generateId').show();  //송장사용시 주석해제
				_element.container.find('._btnExcel').show();
			} 
			
			common.hideAllContent();
			_element.container.show();
		});
	};
	
	var _initCalendar = function() {
		var option = {
			showAnim : 'slideDown'
			, showOtherMonths: true
			, selectOtherMonths: true
			, dateFormat : 'yy.mm.dd'
		};

		_element.fromDate.datepicker(option);
		_element.toDate.datepicker(option);
	};

	var _initSearchOption = function() {
		_initDate();
		_initStatOption();
		_initItemOption();
	};
	
	var _initDate = function() {
		var today = utils.getDateObj();
		_element.fromDate.val(today.year + '.' 
							+ utils.fillZero(today.month, 2) 
							+ '.01');
							
		_element.toDate.val(today.year + '.' 
				+ utils.fillZero(today.month, 2)  + '.' 
				+ utils.fillZero(today.day, 2));
	};

	var _initStatOption = function() {
		var htmlStr = _makeStatOptionHtml('', '주문상태')
			, statList = common.getOrderStatusMap();

		for (var stat in statList) {
			htmlStr += _makeStatOptionHtml(stat, statList[stat]);
		}

		_element.statopt.html(htmlStr);
	};

	var _makeStatOptionHtml = function(value, name) {
		return '<option value="{=VALUE}">{=NAME}</option>'
				.replace('{=VALUE}', value || '')
				.replace('{=NAME}', name || '');
	};
	
	//itemlist callback
	var setItemList = function(){
		itemList = common.getProductItemListNoExcept();
		var  optionHTML = '<option value="">품목</option>'
			, name;

		for (var i = 0, length = itemList.length; i < length; i++) {
			name = itemList[i].name;
			optionHTML += '<option value="' + name + '">' + name + '</option>';
		};
		
		_element.itemopt.html(optionHTML); 
	};

	var _initItemOption = function() {
		itemList = common.setProductItemListNoExcept(setItemList);
	};

	var _changeStatType = function(welTarget) {
		_highlightStatType(welTarget);
		_statType = welTarget.attr('data-type');
	};

	var _highlightStatType = function(welTarget) {
		var parent = welTarget.parent().parent();
		parent.find('li.on').removeClass('on');
		welTarget.parent().addClass('on');
	};
	
	var _callToGetStatResult = function() {
		var param = _getStatResultParam();
		
		if (!param) {
			alert('검색 조건을 입력해주세요.');
			return;
		}
		
		utils.showSpinLayer();
		ajax.request('/stats/order/getList', param, function(response){
			utils.hideSpinLayer();
			var result = response;//변경

			if(!result){
				alert('알 수 없는 오류가 발생했습니다.');
				return;
			}
			_showOrderStatsList(result.returnValue.resultList);
			_adjustLinkURL(param);
			
		});
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

	var _showOrderStatsList = function(resultList) {
		_element.statResultArea.hide();
		
		var length = resultList.length
			, totalPrice = 0
			, price
			, htmlStr = ''
			, order;
		
		for(var i = 0; i < length; i++) {
			order = resultList[i];
			price = order.price - 0;
			if (typeof price === 'number') {
				totalPrice += price;
			}
			
			htmlStr += templates.get('_stats_row', 'text')
						.replace('{=INDEX}', i + 1)
						.replace('{=ITEM}', order.item || '')
						.replace('{=ITEM_CODE}', order.item_code || '')
						.replace('{=SHAPE}', order.shape || '')
						.replace('{=PROCESS}', order.process || '')
						.replace('{=BACKGROUND}', order.background || '')
						.replace('{=SEQ}', order.seq || '')
						.replace('{=ORDERSEQ}', order.seq || '')
						.replace('{=WIDTH}', order.width || '')
						.replace('{=HEIGHT}', order.height || '')
						.replace('{=DEPTH}', order.depth ? 'X ' + order.depth : '' )
						.replace('{=COUNT}', order.count || '')
						.replace('{=PURCHASE_PRICE}', order.purchase_price || '') //매입총액
						.replace('{=PRICE}', order.price || '')
						.replace('{=PURCHASEPRICE}', order.purchaseprice || '')  //매입가
						.replace('{=UNITPRICE}', order.unitprice || '')
						.replace('{=OUTLET_DETAIL}', order.outlet_detail || '')
						.replace('{=FROMDATE}', order.fromDate || '')
						.replace('{=SENDER_POSTCODE}', order.sender_postcode || '')
						.replace('{=SENDER_ADDRESS}', order.sender_address || '')
						.replace('{=SENDER_DETAILADDRESS}', order.sender_detailaddress || '')
						.replace('{=SENDER_NAME}', order.sender_name || '')
						.replace('{=REGISTERED}', order.registered || '')
						.replace('{=USERNAME}', order.username || '')
						.replace('{=ORDER_STATUS}', order.order_status ?  common.getOrderStatus(order.order_status) : '')
						.replace('{=INVOICE_INFO}', order.invoice_info || '')
						.replace('{=INVOICE_NUMBER}', order.invoice_number || '')
						.replace('{=UNIQUECD}', order.uniquecd || '');
			
			
		}	
		htmlStr += templates.get('_stats_total_row', 'text')
					.replace('{=TOTAL_PRICE}', totalPrice);
		
		_element.statResultList.html(htmlStr);
		_element.statResultArea.show();
	};
	
	var _getStatResultParam = function() {
		var param = {}
			, customer = $.trim(_element.customeropt.val())
			, item = _element.itemopt.val()
			, orderStatus = _element.statopt.val()
			, team = _element.teamopt.val()
			, channel = _element.channelopt.val()
			, outlet = $.trim(_element.outletopt.val())
			, fromDate = _element.fromDate.val()
			, toDate = _element.toDate.val()
			, isUnitZero = _element.isUnitZero.is(':checked')
			, isPriceZero = _element.isPriceZero.is(':checked');
		
		 customer && (param.customer = customer);
		 item && (param.item = item);
		 orderStatus && (param.orderStatus = orderStatus);
		 team && (param.team = team);
		 channel && (param.outlet = channel);
		 outlet && (param.outlet_detail = outlet);
		 fromDate && (param.fromDate = fromDate.replace(/\./g, '-'));
		 toDate && (param.toDate = toDate.replace(/\./g, '-'));
		 isUnitZero && (param.isUnitZero = isUnitZero);
		 isPriceZero && (param.isPriceZero = isPriceZero);
		 
		 var isNothing = true;
		 for (key in param) {
			 isNothing = false;
		 }
		 
		 return isNothing ? null : param;
	};
	
	
	var _adjustLinkURL = function(param) {
		var paramStr = ''
			, paramArray = []
			, aList;
		
		for (key in param) {
			paramArray.push(key + '=' + param[key]);
		}
		
		paramStr = '?' + paramArray.join('&');		
		aList = _element.btnArea.find('a');
		$.each(aList, function(index, alink) {
			alink = $(alink);
			var href = alink.attr('href')
						.split('?')[0];
			alink.attr('href', href + paramStr);
		});
	};
	
	

	return exports;
	
})();