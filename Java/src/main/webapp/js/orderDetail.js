b2b.orderDetail = (function() {
	var dom, ajax, template, common, orderModify, orderList, fileUploader, addOrder, utils;

	var _setDependency = function() {
		dom = b2b.dom;
		ajax = b2b.ajax;
		templates = b2b.templates;
		common = b2b.index;
		orderModify = b2b.orderModify;
		orderList = b2b.orderList;
		fileUploader = b2b.fileUploader;
		addOrder = b2b.addOrder;
		utils = b2b.utils;
	};

	var exports = {
		name : 'b2b.orderDetail'
	};

	var _element = {}
		, _currentSeq
		, selectedWorker
		, workerName;

	exports.init = function() {
		_setDependency();
		_assignHTML();
	};

	var _assignHTML = function() {
		_element.wrap = $('._odr_detail');
		_element.imgUploadLayer = $('._img_upload_layer');
		_element.imageInput = $('._upload_img_input');
		_element.attachFileInput = $('._upload_attach_file_input');
		_element.workerLayer = $('._worker_ly');
	};

	exports.onClick = function(we, welTarget) {
		if (welTarget.hasClass('_pass_order')) {
			_passOrderToNext(welTarget);
			
		} else if (welTarget.hasClass('_order_cancel')) {
			_cancelOrder(welTarget);
			
		} else if (welTarget.hasClass('_input_comment')) {
			_inputComment(welTarget);
			
		} else if (welTarget.hasClass('_cmt_del_btn')) {
			_deleteComment(welTarget);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_cmt_modify_btn')) {
			_modifyComment(welTarget);
			we.preventDefault();
		
		} else if (welTarget.hasClass('_cmt_modify_submit')) {
			_submitModifyComment(welTarget);
			we.preventDefault();
		
		} else if (welTarget.hasClass('_cmt_modify_cancel_btn')) {
			_cancelModifyComment(welTarget);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_show_img_upload')) {
			_showImageUploadLayer();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_hide_img_upload')) {
			exports.hideImageUploadLayer();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_input_img')) {
			_inputImage();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_input_attach_file')) {
			_inputAttachFile();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_del_attach_file')) {
			_deleteAttachFile(welTarget);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_enlarge_img') || welTarget.hasClass('_enlarge_img_c')) {
			if (welTarget.hasClass('_enlarge_img_c'))  {
				welTarget = welTarget.parent();
			}
			_enlargeImage(welTarget);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_clk_arrow_prev')) {
			_showNextDraftImg(true);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_clk_arrow_next')) {
			_showNextDraftImg();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_enlarge_img_btn')) {
			_showDraftImg();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_hide_img_btn')) {
			_hideDraftImg();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_show_stat_list')) {
			_toggleStatList();
			we.preventDefault();
			
		} else if (welTarget.hasClass('_change_stat') || welTarget.hasClass('_change_stat_c')) {
			if (welTarget.hasClass('_change_stat_c')) {
				welTarget = welTarget.parent();
			}
			_changeStatus(welTarget);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_draft_img')) {
			_changeDraftImg(welTarget, we);
			we.preventDefault();
			
		} else if (welTarget.hasClass('_order_modify')) {
			orderModify.showOrderModify(welTarget);
			
		} else if (welTarget.hasClass('_select_worker')) {
			_selectWorker();
			
		} else if (welTarget.hasClass('_invoice_info')) {
			_checkValid(); //상세주문페이지 송장란 관리자만 보이게 처리
			
		} else if (welTarget.hasClass('_submit_worker')) {
			_submitWorker();
			
		} else if (welTarget.hasClass('_back_to_list')) {
			_backToList();
			
		} else if (welTarget.hasClass('_confirm_sample')) {
			_confirmSample();
		
		} else if (welTarget.hasClass('_delete_sample')) {
			_deleteSample();
			
		} else if (welTarget.hasClass('_re_order')) {
			_reorder(welTarget);
		}
	};

	exports.viewOrder = function(orderSeq) {
		_currentSeq = orderSeq;
		
		ajax.request('/order/list/' + orderSeq, {}, function(response) {
			var result = response//수정
				, returnValue, orderTemplate, commentBox, commentList;
			
			if (!result) {//수정
				if (result.returnValue.code === 'no_auth') {
					alert('해당 주문을 조회할 권한이 없습니다');
				}
				return;
			}

			returnValue = result.returnValue;
			
			if (!returnValue.orderInfo.order) {
				alert('해당 주문이 존재하지 않습니다.');
				orderList.callToGetCurrentOrder();
				return;
			}		
			//회사가 다르면 갱신 var currunt_comapny = $.cookie('companyName_brand_cookie');
			var currunt_comapny = $.cookie('company');
			var order_company = returnValue.orderInfo.order.company;
			if(currunt_comapny != order_company){
				$.cookie('company', order_company, { expires : 365 });
				window.location.reload();
			}
			
			orderTemplate = _getOrderTemplte(returnValue);
			_element.wrap.html(orderTemplate);
			
			_callToGetOrderStats(orderSeq);
			commentBox = templates.get('_odr_cmt_box_tmpl');
			commentList = _makeHTMLCommentList(returnValue.orderInfo.orderCommentList);
			$(commentBox).find('._cmt_list').append(commentList);
			_element.wrap.append(commentBox);
			
			_loadingSampleList(orderSeq);
			_callToGetAttachFileList(orderSeq);
			_checkValid();
			
			//common.hideAllContent();
			//_element.wrap.show();
		});
	};
	
	var _callToGetOrderStats = function(orderSeq) {
		ajax.request('/order/getOrderForStat', {
			seq: orderSeq
		}, function(response){
			var result = response;//수정
			
			if (!result) {
				return;
			}
			
			var returnValue = result.returnValue
			
			if (!returnValue) {
				return;
			}
			//입금완료 deposited 추가
			var orderForStats = returnValue.orderForStats
				, deposited = orderForStats.deposited //추가
				, designed = orderForStats.designed
				, produced = orderForStats.produced
				, delivered = orderForStats.delivered
				, billed = orderForStats.billed;			
			
			var completePanelArea = $('._complete_panel_area');
			
			if (deposited || designed || produced || delivered || billed) { //입금완료 deposited 추가 , 계산서 발행 완료 billed 추가
				completePanelArea.show();
			}
			
			if (deposited) { //deposited 입금완료 추가
				completePanelArea.find('._deposited').html(deposited);
				completePanelArea.find('._complete_panel_deposited').show()
			}
			
			if (designed) {
				completePanelArea.find('._designed').html(designed);
				completePanelArea.find('._complete_panel_designed').show()
			}
			
			if (produced) {
				completePanelArea.find('._produced').html(produced);
				completePanelArea.find('._complete_panel_produced').show()
			}
			
			if (delivered) {
				completePanelArea.find('._delivered').html(delivered);
				completePanelArea.find('._complete_panel_delivered').show()
			}
			
			if (billed) {
				completePanelArea.find('._billed').html(billed);
				completePanelArea.find('._complete_panel_billed').show()
			}
		});
	};
	
	var _checkValid = function() {
		ajax.request('/order/validCheck/detail', null, function(response){
		
			result = response;//수정
			var valid = result.returnValue;
			
			if (valid === 'hideAll') {
				_element.wrap.find('._select_worker').hide();
				_element.wrap.find('._show_stat_list').hide();
				_element.wrap.find('._pass_order').hide();
				_element.wrap.find('._order_modify').hide();
				_element.wrap.find('._order_cancel').hide();
				_element.wrap.find('._show_img_upload').hide();
				_element.wrap.find('._change_stat').hide();
				_element.wrap.find('._invoice_info').hide();
				_element.wrap.find('._invoice_number').hide();
				
			} else if (valid === 'hideModAndCancel') {
				_element.wrap.find('._order_modify').hide();
				_element.wrap.find('._order_cancel').hide();
				
			} else if (valid === 'hideCancel') {
				_element.wrap.find('._order_cancel').hide();
			}
			
			common.hideAllContent();
			_element.wrap.show();
		});
	};
	//입금완료 L2
	var _replaceButtonClass = function(orderTemplate, orderStatus) {
		if (orderStatus === 'L1') {
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L2}/g, 'btn2');
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_SAMPLE}/g, 'btn2');
			
		} else if (orderStatus === 'L2') {
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L3}/g, 'btn2');
			//orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_SAMPLE}/g, 'btn2'); //디자인완료 일떄 샘플
		} else if (orderStatus === 'L3') {
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L4}/g, 'btn2');
		
		} /*else if (orderStatus === 'L4') {
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L5}/g, 'btn2');
		} else if (orderStatus === 'L5') {
			orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L6}/g, 'btn2');
		}*/
		
		orderTemplate = orderTemplate.replace(/\{=BTN_CLASS_L2}/g, 'btn3')
									.replace(/\{=BTN_CLASS_L3}/g, 'btn3')
									.replace(/\{=BTN_CLASS_L4}/g, 'btn3')
									.replace(/\{=BTN_CLASS_L5}/g, 'btn3')//입금완료 L5
									.replace(/\{=BTN_CLASS_L6}/g, 'btn3')//계산서 발행 완료 L6
									.replace(/\{=BTN_CLASS_SAMPLE}/g, 'btn3');
		return orderTemplate;
	};

	var _getOrderTemplte = function(returnValue) {
		var orderTemplate = templates.get('_tmpl_order_detail', 'text')
			, order = returnValue.orderInfo.order
			, orderStatus = order.order_status
			, orderStatusNextName = common.getOrderStatusNext(orderStatus).value
			, isEditable = returnValue.isEditable
			, companyCode = order.company.substr(0, 3).toUpperCase();
		
		order.description = order.description.replace(/\n/gi, '<br>');
		orderTemplate = _replaceButtonClass(orderTemplate, orderStatus);

		return orderTemplate.replace(/\{=TITLE\}/g, orderList.getTitle(order))
			.replace(/\{=USERNAME\}/g, order.username || '')
			.replace(/\{=USERID\}/g, order.userid || '')
			.replace(/\{=REGISTERED\}/g, order.registered || '')
			.replace(/\{=PAST_ODR\}/g, order.past_odr || '')
			.replace(/\{=PAST_ODR_CODE\}/g, order.past_odr ? companyCode + '-' + order.past_odr : '')
			.replace(/\{=PAST_ODR_SHOW\}/g, order.past_odr ? '' : 'none')
			.replace(/\{=SEQ\}/g, order.seq || '')
			.replace(/\{=ODR_NUM\}/g, companyCode + '-' + order.seq || '')
			.replace(/\{=WORKERNAME\}/g, order.worker_name || '담당자없음')
			.replace(/\{=WORKERID\}/g, order.workerid || '')
			.replace(/\{=ORDER_STATUS\}/g, orderStatus || '')
			.replace(/\{=ORDER_STATUS_NAME\}/g, common.getOrderStatus(orderStatus))
			.replace(/\{=ORDER_STATUS_NAME_NEXT\}/g, orderStatusNextName)
			.replace(/\{=ORDER_STATUS_NAME_NEXT_STYLE\}/g, orderStatusNextName ? '' : 'display:none;')
			.replace(/\{=DESCRIPTION\}/g, order.description || '')
			.replace(/\{=COUNT\}/g, order.count || '')
			.replace(/\{=PRICE\}/g, order.price || '')
			.replace(/\{=PURCHASE_PRICE\}/g, order.purchase_price || '')
			.replace(/\{=SENDER_POSTCODE\}/g, order.sender_postcode || '')
			.replace(/\{=SENDER_ADDRESS\}/g, order.sender_address || '')
			.replace(/\{=SENDER_DETAILADDRESS\}/g, order.sender_detailaddress || '')
			.replace(/\{=SENDER_NAME\}/g, order.sender_name || '')
			.replace(/\{=SENDER_PHONE\}/g, order.sender_phone || '')
			.replace(/\{=DEPOSITOR\}/g, order.depositor || '')
			.replace(/\{=BILL\}/g, order.bill || '')
			.replace(/\{=BUSINESS_NUM\}/g, order.business_num || '')
			.replace(/\{=BUSINESS_TEL\}/g, order.business_tel || '')
			.replace(/\{=BUSINESS_EMAIL\}/g, order.business_email || '')
			.replace(/\{=RECEIPTS_TEL\}/g, order.receipts_tel || '')
			.replace(/\{=TEAM\}/g, order.team || '')
			.replace(/\{=OUTLET_DETAIL\}/g, (order.outlet_detail ? ', ' + order.outlet_detail : ''))
			.replace(/\{=ITEM\}/g, order.item || '')
			.replace(/\{=ITEM_CODE\}/g, order.item_code || '')
			.replace(/\{=SHAPE\}/g, order.shape || '')
			.replace(/\{=PROCESS\}/g, order.process || '')
			.replace(/\{=BACKGROUND\}/g, order.background || '')
			.replace(/\{=BACKGROUND_IMG\}/g, order.background_id ? 'file/download/product?id=' + order.background_id : '')
			.replace(/\{=UNITPRICE\}/g, order.unitprice || '')
			.replace(/\{=PURCHASEPRICE\}/g, order.purchaseprice || '')
			.replace(/\{=WIDTH\}/g, order.width || '')
			.replace(/\{=HEIGHT\}/g, order.height ? ' X ' + order.height : '')
			.replace(/\{=DEPTH\}/g, order.depth ? ' X ' + order.depth : '')
			.replace(/\{=INVOICE_INFO\}/g, order.invoice_info || '')
			.replace(/\{=INVOICE_NUMBER\}/g, order.invoice_number || '')
			.replace(/\{=UNIQUECD\}/g, order.uniquecd || '')
			.replace(/\{=IS_EDITABLE\}/g, isEditable ? '' : 'none');
	};

	var _makeHTMLCommentList = function(commentList) {
		if (!commentList && !commentList.length) {
			return '';
		}

		var result = ''
			, comment;

		for (var i = 0, length = commentList.length; i < length; i++) {
			comment = commentList[i];
			result += _getCommentTmpl(comment);
		}

		return result;
	};

	var _passOrderToNext = function(welTarget) {
		var orderElem = dom.getParentElem(welTarget, '_tmpl_order_detail', 10)
			, orderSeq = orderElem.data('orderseq')
			, orderStatus = orderElem.data('orderstatus')
			, nextStatus = common.getOrderStatusNext(orderStatus).key;

		if (!nextStatus) {
			return;
		}

		_updateStatus(orderSeq, nextStatus, function(){
			alert(common.getOrderStatus(nextStatus) + ' 상태로 변경되었습니다.')
			exports.viewOrder(orderSeq);
		});
	};

	var _cancelOrder = function(welTarget) {
		var orderElem = dom.getParentElem(welTarget, '_tmpl_order_detail')
			, orderSeq = orderElem.data('orderseq')
			, orderStatus = orderElem.data('orderstatus')

		if (!confirm('본 주문을 삭제하시겠습니까? 삭제한 주문은 복구되지 않습니다')) {
			return;
		}
		
		ajax.request('/order/delete', {
			seq: orderSeq
		}, function(response) {
			var result = response;
			if (!result) { 
			alert('일시적인 오류가 발생했습니다.');
				return;
			}
			
			orderList.callToGetCurrentOrder();
		});
	};

	var _inputComment = function(welTarget) {
		var orderElem = $('._tmpl_order_detail')
			, orderSeq = orderElem.data('orderseq')
			, textarea = welTarget.prev()			
			, commentStr = $.trim(textarea[0].value);

		if (!commentStr) {
			alert('댓글을 입력해주세요');
			return;
		}

		ajax.request('/order/comment/submit', {
			order_seq : orderSeq
			, content : commentStr
		}, function(response){
			var returnValue = response.returnValue
				//TODO 수정 필요
				, commentList
				, comment;
			if (!response) {
				alert('일시적으로 오류가 발생헸습니다.');
			}

			commentList = returnValue.returnValue;			
			comment = commentList[commentList.length - 1];

			template = _getCommentTmpl(comment);

			$('ul._cmt_list').append($(template));
			textarea[0].value = '';
		}, 'POST');
	};
	
	var _getCommentTmpl = function(comment) {
		return templates.get('_odr_cmt_item_tmpl', 'text')
			.replace(/{=EDITABLE}/, comment.editable ? '' : 'none')
			.replace(/{=COMMENT_SEQ}/, comment.comment_seq)
			.replace(/{=DATE}/, comment.registered)
			.replace(/{=USERNAME}/, comment.writer ? comment.writer.username || '': '')
			.replace(/{=CONTENT}/, utils.makeBr(comment.content));
	};

	var _deleteComment = function(welTarget) {
		var answer = confirm('댓글을 삭제하시겠습니까? ');
		if(!answer) return;
		
		var orderSeq = exports.getOrderSeq()
			, comment = dom.getParentElem(welTarget, '_odr_cmt_item_tmpl')
			, commentSeq = comment.data('commentseq');

		ajax.request('/order/comment/delete', {
			order_seq : orderSeq
			, comment_seq : commentSeq
		}, function(response){
			comment.remove();
		}, 'POST');
	};
	
	var _modifyComment = function(welTarget) {
		var comment = dom.getParentElem(welTarget, '_odr_cmt_item_tmpl')
			, commentText = comment.find('.cmt_desc').html();
		
		comment.find('textarea').val(commentText);		
		comment.find('.cmt_desc').hide();
		comment.find('.cmt_modify').show();
		comment.find('._cmt_modify_btn').hide();
		comment.find('._cmt_modify_cancel_btn').show();
	};
	
	var _cancelModifyComment = function(welTarget) {
		var comment = dom.getParentElem(welTarget, '_odr_cmt_item_tmpl');
		
		comment.find('.cmt_desc').show();
		comment.find('.cmt_modify').hide();
		comment.find('._cmt_modify_btn').show();
		comment.find('._cmt_modify_cancel_btn').hide();
	};	
	
	var _submitModifyComment = function(welTarget) {
		var orderSeq = exports.getOrderSeq()
			, comment = dom.getParentElem(welTarget, '_odr_cmt_item_tmpl')
			, commentSeq = comment.data('commentseq')
			, text = comment.find('textarea').val();
		
		ajax.request('/order/comment/modify', {
			order_seq: orderSeq
			, comment_seq : commentSeq
			, content: text			
		}, function(response) {
			/*var result = response.result;
			
			if (!result.success) {*/ //origin
			var result = response;			
			if (!result) {
				alert('일시적인 오류가 발생했습니다.');
				return;
			}
			
			_showCommentList(result.returnValue);
		}, 'POST');		
	};
	
	var _getCommentList = function(orderSeq) {
		ajax.request('/order/comment/list', {
			seq: orderSeq
		}, function(response) {
			/*var result = response.result;
			
			if (!result.success) {*/ //origin
			var result = response; //수정
			
			if (!result) {//수정
				alert('댓글 목록을 가져오기 못했습니다.');
				return;
			}
			
			var commentList = result.returnValue;
			_showCommentList(commentList);			
		})	
	};
	
	var _showCommentList = function(commentList) {
		var commentBox = $('._odr_cmt_box_tmpl') 
			, HTMLtext = _makeHTMLCommentList(commentList);
		
		commentBox.find('._cmt_list').html(HTMLtext);
	};
	
	exports.getOrderSeq = function() {
		return $('._tmpl_order_detail').data('orderseq');
	};
	
	exports.getOrderItem = function() {
		return $('._tmpl_order_detail')
				.find('._add_odr_item')
				.html()
	};
	
	exports.getOrderShape = function() {
		return $('._tmpl_order_detail')
				.find('._add_odr_shape')
				.html()
	};	
	//시안이미지 선택했을때 콜백
	var _enlargeImage = function(welTarget) {
		var parent = dom.getParentElem(welTarget, '_sample_img_tmpl');
		welTarget.parent().parent().find('.on').removeClass('on');
		parent.find('a').addClass('on');	//선택 항목 테두리 그리기
		
		var imgPath = parent.find('img').attr('src');
		$('._draft_img').attr('src', imgPath);
		_showDraftImg();	//시안이미지 크게 하단 영역에 출력
	};

	var _showDraftImg = function() {
		$('._odr_draft_img_box').show();
		$('._toggle_draft_img_btn').html('▲ 접기')
			.removeClass('_enlarge_img_btn')
			.addClass('_hide_img_btn');
		
		var top = _element.wrap.find('._odr_draft_img_lst_box').offset().top;
		window.scrollTo(0, top - 50);

		setTimeout(function(){
			_setDraftImgArrowPos();	
		}, 50);		
	};

	var _setDraftImgArrowPos = function() {
		var box = $('._odr_draft_img_box')
			, boxHeight = box.height()
			, boxWidth = box.width()
			, boxOffset = box.offset()
			, boxLeft = boxOffset.left
			, boxTop = boxOffset.top
			, prevArrow = $('div._clk_arrow_prev')
			, nextArrow = $('div._clk_arrow_next')
			, arrowHeight = prevArrow.height()
			, arrowWidth = prevArrow.width()
			, arrowTop = boxTop //+ (boxHeight / 2) - (arrowHeight / 2);

		prevArrow.css('top', arrowTop)
			.css('left', 10);
		nextArrow.css('top', arrowTop)
			.css('left', boxWidth - arrowWidth);
	};

	var _hideDraftImg = function() {
		$('._odr_draft_img_box').hide();
		$('._toggle_draft_img_btn').html('▼ 크게보기')
			.removeClass('_hide_img_btn')
			.addClass('_enlarge_img_btn');			
	};

	var _changeDraftImg = function(welTarget, we) {
		if (_isLeftOnDraftImg(welTarget, we.pageX)) {
			_showNextDraftImg(true);
		} else {
			_showNextDraftImg();
		}
	};

	var _showImageUploadLayer = function() {
		common.showDimmedLayer();
		_element.imgUploadLayer.show();
	};

	exports.hideImageUploadLayer = function() {
		common.hideDimmedLayer();
		_element.imgUploadLayer.hide();
	};

	var _inputImage = function() {
		_element.imageInput.trigger('click');
	};

	var _toggleStatList = function() {
		var statList = $('._stat_list');

		if (statList.is(':hidden')) {
			_setStatList(statList);
		}

		statList.toggle();
	};

	var _setStatList = function(statList) {
		var orderStatusMap = common.getOrderStatusMap()
			, statusHTML = '';

		for (key in orderStatusMap) {
			statusHTML += '<li class="__order_detail _change_stat" data-status="' + key + '">'
						+ '<a href="#" class="__order_detail _change_stat_c">'
						+ orderStatusMap[key] + '</a></li>';
		}

		statList.find('ul').html(statusHTML);
	};

	var _changeStatus = function(welTarget) {
		var status = welTarget.attr('data-status')
			, orderElem = dom.getParentElem(welTarget, '_tmpl_order_detail', 10)
			, orderSeq = orderElem.data('orderseq')
			, orderStatus = orderElem.data('orderstatus');

		if (status === orderStatus) {
			return;
		}

		var answer = confirm(common.getOrderStatus(status) + '완료로 상태를 변경하시겠습니까?');
		if(!answer) 
		{
			return;
		}
		_updateStatus(orderSeq, status, function(){
			$('._stat_list').hide();
			alert(common.getOrderStatus(status) + ' 상태로 변경되었습니다.')
			exports.viewOrder(orderSeq);
		});
	};

	var _updateStatus = function(orderSeq, status, callback) {
		ajax.request('/order/status', {
			seq : orderSeq
			, order_status : status
		}, function(response){
			/*var result = response.result;

			if (!result.success) {*/ //origin
			var result = response;

			if (!result) {
				alert('오류가 발생했습니다.');
				return;
			}

			if (typeof callback === 'function') {
				callback();
			}			
		}, 'POST');
	};

	var _showNextDraftImg = function(isPrev) {
		var item = $('._enlarge_img.on').parent();
		item = isPrev ? item.prev() : item.next();

		if (!item[0]) {
			return;
		}

		_enlargeImage($(item.children()[0]));
	};

	exports.changeCursor = function(event, elTarget) {
		var welTarget = $(elTarget)
			, src;

		if (dom.isClickOnLeft(elTarget, event)) {
			src = '/img/prevcur.ico';
		} else {
			src = '/img/nextcur.ico';
		}

		welTarget.css('cursor', 'url(' + src + '), e-resize')
	};

	var _isLeftOnDraftImg = function(img, posX) {
		var left = $(img).offset().left
			, width = $(img).width();

		if (left + (width / 2) < posX) {
			return false;
		}

		return true;
	};
	
	var _loadingSampleList = function(orderSeq) {
		ajax.request('/sample/getList', {
			seq : orderSeq
		}, function(response) {
			var result = response; //수정
			
			if (!result) { //수정
				alert('알 수 없는 오류가 발생했습니다.');
				return;
			}
						
			var sampleList = result.returnValue.sampleList;			
			_showSampleList(sampleList);			
			_adjustButtonStatus(sampleList.length > 0);
		});
	};
	
	var _adjustButtonStatus = function(hasSample) {
		var plainButton
			, blackButton
			, sampleButton = $('._head_btn_area').find('._show_img_upload')
			, designButton = $('._head_btn_area').find('button[data-status=L3]')
			, depositButton = $('._head_btn_area').find('button[data-status=L2]');
		
		if (hasSample) {
			plainButton = sampleButton;
			if (_getCurrentOrderStatus() == 'L1') {
				/*blackButton = designButton;*/ //depositButton으로 변경
				blackButton = depositButton;
			}
			
		} else {
			/*plainButton = designButton;*/ //->deposit으로 변경
			plainButton = depositButton;
			if (_getCurrentOrderStatus() == 'L1') {
				blackButton = sampleButton;
			}
		}
		
		plainButton.removeClass('btn2')
			.addClass('btn3');
		
		if (blackButton && blackButton[0]) {
			blackButton.removeClass('btn3')
				.addClass('btn2');
		}
	};
	
	var _getCurrentOrderStatus = function() {
		return $('._tmpl_order_detail').attr('data-orderstatus');
	};
	
	var _showSampleList = function(sampleList) {
		var draftArea = $('._draft_area')
			, sampleListArea = _element.wrap.find('._odr_draft_img_lst_box');

		if (!sampleList || sampleList.length < 1) {
			draftArea.hide();
			sampleListArea.hide();
		}
		
		var resultHTML = ''
			, sampleTmpl = templates.get('_sample_img_tmpl', 'text');
		
		$.each(sampleList, function(index, sample) {
			resultHTML += sampleTmpl.replace(/{=SEQ}/g, sample.seq)
							.replace(/{=FILENAME}/g, sample.fileName)
							.replace(/{=CONFIRMED}/g, sample.confirmed ? '' : 'none');
		});
		
		sampleListArea.html(resultHTML)
			.show();
		draftArea.show();
	};
	
	
	var _showWorkerLayer = function() {
		common.showDimmedLayer();
		_selectWorker();
		_element.workerLayer.show();
	};
	
	exports.completeSampleUpload = function() {		
		_loadingSampleList(_currentSeq);
		exports.hideImageUploadLayer();
		fileUploader.removeIframe();
	};
	
	exports.completeAttachFileUpload = function() {
		fileUploader.removeIframe();
		$('._selected_attach_file_area').hide();
		_callToGetAttachFileList(_currentSeq);
	};
	
	//test 개발 후 삭제
	exports.showWorkerLayer = function() {
		common.showDimmedLayer();
		_showWorkerLayer();
	};
	
	exports.hideWorkerLayer = function() {
		common.hideDimmedLayer();
		_element.workerLayer.hide();
	};
	
	var _selectWorker = function() {
		common.showDimmedLayer();
		_loadWorkers();
	};
	
	var _loadWorkers = function() {
		ajax.request('/order/getWorkers', null, function(response){
			result = response; //수정
			workerList = result.returnValue; 
			
			_makeTotalWorkersHTML(workerList);
			_element.workerLayer.show();
		});
	};
	
	var _makeTotalWorkersHTML = function(workerList) {
		var admin = workerList.admin
			, sales = workerList.sales
			, pm = workerList.pm
			, designer = workerList.designer
			, outsourcing = workerList.outsourcing;
		
//		_makeWorkerHTML(admin, "admin");
		_makeWorkerHTML(sales, "sales");
//		_makeWorkerHTML(pm, "pm");
		_makeWorkerHTML(designer, "designer");
//		_makeWorkerHTML(outsourcing, "outsourcing");
	};
	
	var _makeWorkerHTML = function(obj, group) {
		var workersHTML = ""
			, totalWorkersHTML = "";
		
			for(var i = 0; i < obj.length; i++){
				workersHTML = '<li class=""><a href="#" data-userid="'+obj[i].userid+'" onclick="b2b.orderDetail.setSelectedWorker(this);return false;">' + obj[i].username + '</a></li>';
				totalWorkersHTML += workersHTML;
			}
			
			if(obj.length > 0){
				_element.workerLayer.find('._' + group + '_text').show();
				_element.workerLayer.find('._' + group).html(totalWorkersHTML);
			}
	};
	
	exports.setSelectedWorker = function(elTarget) {
		welTarget = $(elTarget);
		_element.workerLayer.find('li').each(function(){
			$(this).removeClass('on');
		});
		welTarget.parent().addClass('on');
		workerName = welTarget.html();
		selectedWorker = welTarget.attr('data-userid');
	};
	
	var _submitWorker = function(){
		var orderElem = $('._tmpl_order_detail')
			, orderSeq = orderElem.data('orderseq')
			, order ={};
		
		order.seq = orderSeq;
		order.workerid = selectedWorker;
		
		ajax.request('/order/setWorker', order, function(response){
			_element.workerLayer.hide();
			common.hideDimmedLayer();
			$('._tmpl_order_detail').find('.info').find('._worker_name').html(' 담당자 : '+ workerName );
			alert('담당자가 선택되었습니다.');
		},'POST');
	};
	
	var _backToList = function() {
		orderList.callToGetAllOrder();
		_element.wrap.hide();
	};
	
	var _getSelectedSample = function(mode) {
		var selected = _element.wrap.find('._odr_draft_img_lst_box .on')
			, parent = dom.getParentElem(selected, '_sample_img_tmpl');
		var selected_display_status = selected.siblings('.confirm_ct').css('display');
		if(mode == 'delete' && selected_display_status == 'block'){
			return;
		}
		return parent;
	};

	var _confirmSample = function() {
		var sample = _getSelectedSample()
			, orderSeq = exports.getOrderSeq();
		
		if(sample){
			ajax.request('/sample/confirm', {
				seq : sample.attr('data-seq')
				, orderSeq : orderSeq
			}, function(response) {
                
				var result = response; 
				if (!result) { 
					alert('일시적인 오류가 발생했습니다.');
					return;
				}
				
				_loadingSampleList(orderSeq);
			});
			return;
		}
		else{
			alert('이미 승인된 시안입니다');
		}
	};
	
	var _deleteSample = function() {		
		var sample = _getSelectedSample()
		, orderSeq = exports.getOrderSeq();
		
		if (!sample[0]) {
			return;
		}
		
		if (!confirm('현재 선택된 시안을 삭제하시겠습니까?')) {
			return;
		}
		
		ajax.request('/file/delete/sample/', {
			seq : sample.attr('data-seq')
			, orderSeq : orderSeq
		}, function(response) 
			if (!result) { 
				alert('일시적인 오류가 발생했습니다.');
				return;
			}
			_hideDraftImg();
			_loadingSampleList(orderSeq);
		});
	};
	//재주문하기
	var _reorder = function(welTarget) {
		var orderElem = $('._tmpl_order_detail')
			, orderSeq = orderElem.data('orderseq');
		
		addOrder.reorder(orderSeq, function(){
			_element.wrap.hide();
		});
	};
	
	var _callToGetAttachFileList = function(orderid) {
		orderid = orderid || exports.getOrderSeq();
		ajax.request('/orderAttachFile/getList', {
			orderid: orderid
		}, function(response) {
			
			var result = response;//수정
			
			
			if (!result) {//수정
				alert('일시적인 오류가 발생하였습니다.');
			}
			
			var fileList = result.returnValue.fileList;
			_showAttachFileList(fileList);
		});
	};
	
	var _showAttachFileList = function(fileList) {
		var fileListHTML = _makeFileListHTML(fileList);
		fileListHTML = fileListHTML || '첨부된 파일이 없습니다.';
		$('._odr_attach_file_lst_box').html(fileListHTML);
	};
	
	var _makeFileListHTML = function(fileList) {
		var template = templates.get('_odr_attach_file_item_tmpl', 'text')
			, resultHTML = ''
			, file;
		
		for (var i = 0; i < fileList.length; i++) {
			file = fileList[i];
			resultHTML += template.replace(/{=SEQ}/gi, file.seq)
								.replace(/{=ORIGINAL_FILENAME}/gi, file.original_filename)
								.replace(/{=SIZE}/gi, file.size ? '(' + file.size + ')' : '')
		}
		
		return resultHTML;
	};
	
	var _inputAttachFile = function() {		
		_element.attachFileInput.trigger('click');		
	};
	
	var _deleteAttachFile = function(welTarget) {
		if (!confirm('첨부파일을 삭제하시겠습니까?')) {
			return;
		}
		
		var seq = dom.getParentElem(welTarget, '_odr_attach_file_item_tmpl')
					.attr('data-seq');
		
		ajax.request('/orderAttachFile/delete', {
			seq: seq
		}, function(response) {
	
			var result = response;
			
			if (!result) { //수정
				alert('일시적인 오류가 발생했습니다.');
				return;
			}
			
			alert('삭제가 완료되었습니다.');
			_callToGetAttachFileList();
		});
	};
	/*파일 선택하기*/
	exports.showAttachFileArea = function(fileInput) {
		
		//20메가가 넘으면 파일을 지우고 파일용량 안내문구를 보임
		if(fileInput.files[0].size > 20*1024*1024 ) {
			alert('첨부파일은 20메가를 넘을 수 없습니다');
			$('._upload_attach_file_input').val('');
			return false;
		}
		
		var path = fileInput.value
			, splitPath = path.split('\\')
			, filename = splitPath[splitPath.length - 1];
		
		$('._selected_attach_file_area').find('span').html(filename);
		$('._selected_attach_file_area').show();
	};
	
	exports.completeUpload = function() {
		var uploadKey = fileUploader.getUploadKey();
		
		if (uploadKey === 'sample') {
			exports.completeSampleUpload();		
			
		} else if (uploadKey === 'orderAttachFile') {
			exports.completeAttachFileUpload();
		}
	};

	return exports;
})();