package net.fe.buma.stats.service;

import java.sql.SQLException;
import java.text.ParseException;
//import java.util.Date;
import java.util.List;

import net.fe.buma.order.enumeration.OrderStatus;
//import net.fe.buma.order.model.Order;
import net.fe.buma.order.model.OrderRequest;
import net.fe.buma.stats.model.AdjustTimeRequest;
import net.fe.buma.stats.model.OrderForStats;
import net.fe.buma.stats.model.OrderSearchCondition;
import net.fe.buma.stats.mybatis.OrderForStatsDAO;
//import net.fe.buma.support.util.DateUtils;
import net.fe.buma.user.mybatis.UserMapper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderForStatsService {
	
	@Autowired
	OrderForStatsDAO orderForStatsDAO;
	
	@Autowired
	OrderForStatsDataHandleService dataHandleService;
	
	@Autowired
	UserMapper userMapper;
	
	
	public OrderForStats getOrder(long orderSeq) throws SQLException {
		return orderForStatsDAO.getOrder(orderSeq);
	}
	/*타임로그 리스트 가져오기*/
	public Object getOrderList(OrderSearchCondition condition) throws SQLException, ParseException {
		String customer = condition.getCustomer();
		String userid = "";
		//주문자의 이름으로 아이디를 찾는다
		if (StringUtils.isNotEmpty(customer)) {
			userid = userMapper.getIdByName(customer);
			
			if (StringUtils.isEmpty(userid)) {
				return null;
			}
			condition.setUserid(userid);
		}
		//통계 데이터 리스트 불러온 후 
		//가공하여 필드 업데이트
		List<OrderForStats> resultList = orderForStatsDAO.getOrderList(condition);
		dataHandleService.restructList(resultList);
		return resultList;
	}
	
	public boolean updateOrderStatus(OrderRequest orderRequest, String userid) throws SQLException {
		String statusColumnName = getStatusColumnName(orderRequest.getOrder_status());		 
		if (StringUtils.isEmpty(statusColumnName)) {
			return false;
		}
		return orderForStatsDAO.updateOrderStatus(orderRequest.getSeq(), statusColumnName, userid);
	}
	
	private String getStatusColumnName(OrderStatus status) {
		String statusCode = status.getCode(); //임금완료,계산서발행 추가
		if (statusCode == OrderStatus.L2.getCode()) {
			return "designed";
			
		} else if (statusCode == OrderStatus.L3.getCode()) {
			return "produced";
			
		} else if (statusCode == OrderStatus.L4.getCode()) {
			return "delivered";
			
		} else if (statusCode == OrderStatus.L5.getCode()) {
			return "deposited";
		
		} else if (statusCode == OrderStatus.L6.getCode()) {
			return "billed";
		}
		
		return null;
	}

	public void updateSampledFirst(String orderid, String designerid) throws SQLException {		
		long orderSeq = Long.parseLong(orderid);
		if (hasSampled(orderSeq)) {
			return;
		}
		
		orderForStatsDAO.updateSampledFirst(orderSeq, designerid);
	}
	
	private boolean hasSampled(long orderSeq) throws SQLException {
		OrderForStats order = getOrder(orderSeq);
		if (order == null) {
			return false;
		}
		return StringUtils.isNotEmpty(order.getSampled_first());
	}

	public boolean adjustTime(AdjustTimeRequest request) throws SQLException {
		return orderForStatsDAO.adjustTime(request);		
	}
}
