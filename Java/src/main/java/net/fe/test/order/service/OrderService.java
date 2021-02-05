package net.fe.buma.order.service;

import com.carrotsearch.ant.tasks.junit4.dependencies.com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import lombok.extern.slf4j.Slf4j;
import net.fe.buma.lucene.OrderCommentAnalyzer;
import net.fe.buma.notice.model.Notice;
import net.fe.buma.notice.mybatis.NoticeMapper;
import net.fe.buma.order.enumeration.OrderStatus;
import net.fe.buma.order.enumeration.Team;
import net.fe.buma.order.model.LightOrderInfo;
import net.fe.buma.order.model.MonthlyOrder;
import net.fe.buma.order.model.Order;
import net.fe.buma.order.model.OrderComment;
import net.fe.buma.order.model.OrderByTeam;
import net.fe.buma.order.model.OrderRequest;
import net.fe.buma.order.model.Worker;
import net.fe.buma.order.mybatis.OrderCommentMapper;
import net.fe.buma.order.mybatis.OrderDAO;
import net.fe.buma.sms.service.SmsService;
import net.fe.buma.stats.model.OrderForStats;
import net.fe.buma.stats.mybatis.OrderForStatsDAO;
import net.fe.buma.stats.service.OrderForStatsService;
import net.fe.buma.support.paging.Pagable;
import net.fe.buma.support.util.ConvertUtils;
import net.fe.buma.support.util.DateUtils;
import net.fe.buma.support.util.IPUtils;
import net.fe.buma.user.enumeration.UserType;
import net.fe.buma.user.model.User;
import net.fe.buma.user.mybatis.UserMapper;

import org.apache.commons.lang3.StringUtils;
import org.apache.lucene.queryparser.classic.ParseException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

@Service
@Slf4j
public class OrderService {

	@Autowired
	OrderDAO orderDAO;
	
    @Autowired
    OrderCommentAnalyzer orderCommentAnalyzer;

    @Autowired
    OrderCommentMapper orderCommentMapper;

    @Autowired
    UserMapper userMapper;
    
    @Autowired
	SmsService smsService;
    
    @Autowired
    NoticeMapper noticeMapper;
    
    @Autowired
	OrderForStatsService orderForStatsService;
    
    @Autowired
	OrderForStatsDAO orderForStatsDAO;
    
    @Autowired
    OrderForNoticeService orderForNoticeService;
    
    
    //모든 유저의 댓글을 가져온다
    public List<OrderComment> listAllUsersComment(Pagable pagable){
    	
    	int totalCommentCnt = orderCommentMapper.getAllUserCommentCount(pagable);
    	pagable.setTotalCount(totalCommentCnt);
    	
    	return orderCommentMapper.getAllUserComment(pagable);
    }
    
    
    
    public int insertOrder (OrderRequest orderRequest) throws SQLException {
    	int orderSeq = orderDAO.insertOrder(orderRequest);
    	orderForStatsDAO.insertOrder(orderRequest);
    	return orderSeq;
    }
    
    public long getCount(Pagable pagable) throws SQLException{    	
    	String searchType = pagable.getSearchType();
    	
    	if (StringUtils.isNotEmpty(searchType) && searchType.equals("content")) {
    		return orderDAO.getCountOrdersHasContent(pagable);
    	}
    	
    	return orderDAO.getCount(pagable);
    }
    
    public long getCountByStatus(Pagable pagable) throws SQLException {
    	return orderDAO.getCountByStatus(pagable);
	}

    public List<LightOrderInfo> getAllOrder(Pagable pagable) throws Exception {
    	String searchType = pagable.getSearchType();    	
    	
    	List<Order> orders;
    	if (StringUtils.isNotEmpty(searchType) && searchType.equals("content")) {
    		orders = orderDAO.getOrdersHasContent(pagable);
    	} else {
    		orders = orderDAO.getOrders(pagable);
    	}
        
        return getRestructedOrderList(orders);
    }
    
    private List<LightOrderInfo> getRestructedOrderList(List<Order> orders) throws Exception {
    	List<LightOrderInfo> lightOrders = Lists.newArrayList();

    	Order order = null;
    	for (int i = 0, size = orders.size(); i < size; i++) {
    		order = orders.get(i);
    		setCustomerAndWorker(order);
    		setDateFormat(order);
    		setOrderAndCommentListAndItem(order, lightOrders);
    	}
        
    	return lightOrders;
    }
    
    public void setDateFormat(Order order) throws Exception {
    	if (order == null) {
    		return;
    	}
    	String registered = DateUtils.processDate(order.getRegistered());
    	order.setRegistered(registered);
    }
    
    public void setCommentDateFormat(OrderComment orderComment) throws Exception {
    	String registered = DateUtils.processDate(orderComment.getRegistered());
    	orderComment.setRegistered(registered);
    }
    
    public void setCustomerAndWorker(Order order) {
    	if (order == null) {
    		return;
    	}
    	
         String userid = order.getUserid();
         String username = userMapper.getNameById(userid);
         if (!StringUtils.isEmpty(username)) {
             order.setUsername(username);
         }

         String workerid = order.getWorkerid();
         String workername = userMapper.getNameById(workerid);
         //User user = userMapper.getUser(workerid);
         if (!StringUtils.isEmpty(workername)) {
       		 order.setWorker_name(workername);
         }
    }
    
    private void setOrderAndCommentListAndItem(Order order, List<LightOrderInfo> lightOrders) throws Exception {
        LightOrderInfo lightOrderInfo = new LightOrderInfo();
        List<OrderComment> orderComments = getOrderComments(order.getSeq());
        lightOrderInfo.setOrderCommentList(orderComments);
        lightOrderInfo.setOrder(order);
        lightOrders.add(lightOrderInfo);
    }
    
	public List<LightOrderInfo> getOrdersByStatus(Pagable pagable) throws Exception {
		List<Order> orders;    	
    	orders = orderDAO.getOrdersByStatus(pagable);
        return getRestructedOrderList(orders);
	}

    public LightOrderInfo getOrder(long seq, String userid, String role) throws Exception {
        Order order = orderDAO.getOrder(seq);
        LightOrderInfo lightOrderInfo = new LightOrderInfo();
        
        if (order != null) {
        	setCustomerAndWorker(order);
            setDateFormat(order);            
            List<OrderComment> orderComments = getOrderCommentsEditable(order.getSeq(), userid, role);
            lightOrderInfo.setOrderCommentList(orderComments);
        }
        
        lightOrderInfo.setOrder(order);
        return lightOrderInfo;
    }

    public List<OrderComment> getOrderComments(long orderSeq) throws Exception {
        List<OrderComment> orderComments = orderCommentMapper.getOrderComments(orderSeq);
        OrderComment orderComment;
        
        for (int i = 0, size = orderComments.size(); i < size; i++) {
        	orderComment = orderComments.get(i);
        	String writerId = orderComment.getWriter_id();
        	User user = userMapper.getUser(writerId);
        	
        	if (user != null) {
        		orderComment.setWriter(user);
        	}
        	
        	setCommentDateFormat(orderComment);
        }

        return orderComments;
    }
    
    public List<OrderComment> getOrderCommentsEditable(long orderSeq, String userid, String role) throws Exception {
    	List<OrderComment> orderComments = getOrderComments(orderSeq);
    	OrderComment orderComment;
    	
    	for (int i = 0, size = orderComments.size(); i < size; i++) {
    		orderComment = orderComments.get(i);
        	String writerId = orderComment.getWriter_id();
        	
        	if (role == "ADMIN"){
        		orderComment.setEditable(true);
        		
    		} else if (writerId.equals(userid)) {
        		orderComment.setEditable(true);
        		
        	} else {
        		orderComment.setEditable(false);
        	}
    	}
    	
    	return orderComments;
    }

    public OrderComment getComment(long commentSeq) {
        OrderComment orderComment = orderCommentMapper.getOrderCommentsByCommentSeq(commentSeq);
        String writer_id = orderComment.getWriter_id();
        User user = userMapper.getUser(writer_id);
        if (user != null) {
            orderComment.setWriter(user);
        }

        return orderComment;
    }

    public void insertOrderComment(HttpServletRequest request, OrderComment orderComment) throws SQLException {
        orderCommentMapper.insertOrderComment(orderComment);
        long order_seq = orderComment.getOrder_seq();
        String commentShort = StringUtils.substring(orderComment.getContent(), 0, 10);
        String noticeContent = "["+order_seq+"]" + " 주문의 댓글 \"" + commentShort + "...\"";
        orderForNoticeService.sendNotice(request, order_seq, orderComment.getWriter_id(), orderComment.getCompany(), noticeContent);
    }
    
    public void updateOrderComment(OrderComment orderComment) {
    	orderCommentMapper.updateOrderComment(orderComment);
    }

    public void deleteOrderComment(OrderComment orderComment) {
        orderCommentMapper.deleteOrderComment(orderComment);
    }

    public List<OrderComment> searchComment(String query) throws IOException, ParseException {
        return orderCommentAnalyzer.query(query);
    }
    
    public Map<String, String> getOrderStatusMap() {
    	Map<String, String> orderStatusMap = Maps.newHashMap();
        for(OrderStatus each : OrderStatus.values()){
            orderStatusMap.put(each.getCode(), each.getText());
        };
        
    	return orderStatusMap;
    }
    
    public MonthlyOrder getMonthlyOrder(String company, String userId) throws SQLException {
    	String month = "";
    	String Date = "";
    	OrderStatus tempStatus;
    	int tempYear;
    	int tempMonth;
    	int allCount = 0;
    	int nowCount = 0;
    	int doneCount = 0;
    	int totalPrice = 0;
    	MonthlyOrder monthlyOrder = new MonthlyOrder();
    	List<OrderRequest> monthlyOrderList = new ArrayList<OrderRequest>();
    	Calendar calendar = Calendar.getInstance( );
    	tempMonth = calendar.get(Calendar.MONTH) + 1;
    	tempYear = calendar.get(Calendar.YEAR);
    	if (tempMonth < 10) {
    		month = "0";
    	}
    	
    	month = month + tempMonth;
    	Date = tempYear + "-" + month;
    	
    	String group = userMapper.getUserRoleById(userId);
    	if(group.equals(UserType.ADMIN.getCode()) || group.equals(UserType.BUMA_SALES.getCode()) || group.equals(UserType.BUMA_DESIGNER.getCode()) || group.equals(UserType.BUMA_PM.getCode()) || group.equals(UserType.B2B_MASTER.getCode()) || group.equals(UserType.OUTSOURCING.getCode())){
        	monthlyOrderList = orderDAO.getOrderByDate(Date, company);
    	} else if (group.equals(UserType.B2B_SALES.getCode())) {
    		monthlyOrderList = orderDAO.getOrderByDateAndId(Date, userId, company);
    	}
    	
    	allCount = monthlyOrderList.size();
    	
    	for (int i = 0; i < monthlyOrderList.size(); i++) {
    		tempStatus = monthlyOrderList.get(i).getOrder_status();
    		
    		if (tempStatus.getCode().equals("L4")) {
    			doneCount += 1;
    		}
    		
    		if (monthlyOrderList.get(i).getPrice() != null) {
    			totalPrice +=  Integer.parseInt(monthlyOrderList.get(i).getPrice());
    		}
    	}
    	
    	nowCount = allCount - doneCount;
    	month = tempMonth + "";
    	
    	String price;
    	DecimalFormat decimalFormat = new DecimalFormat("#,##0");
    	price = decimalFormat.format(totalPrice);
    	
    	monthlyOrder.setTotalPrice(price);
    	monthlyOrder.setTotalOrderCount(allCount);
    	monthlyOrder.setDoneOrderCount(doneCount);
    	monthlyOrder.setNowOrderCount(nowCount);
    	monthlyOrder.setMonth(month);
    	
    	return monthlyOrder;
    }
    
    public void changeOrderStatus(HttpServletRequest request, OrderRequest orderRequest, String userid) throws SQLException {
    	orderDAO.updateOrderStatus(orderRequest);
    	orderForStatsService.updateOrderStatus(orderRequest, userid); 	 
    	handleChangeOrderStatusResult(request, orderRequest, userid);
    }
    
    private void handleChangeOrderStatusResult(HttpServletRequest request, OrderRequest orderRequest, String updateUserid) throws SQLException {
    	OrderStatus orderStatus = orderRequest.getOrder_status();
    	String code = orderStatus.getCode();
    	Integer seq = (int) orderRequest.getSeq();
    	String content = "";
    	
    	if (code.equals("L2")) {
    		content = "["+seq+"]" + " 주문 디자인 완료";
			 
    	} else if (code.equals("L3")) {
    		content = "["+seq+"]" + " 주문 제작 완료";
			 
    	} else if (code.equals("L4")) {
    		content = "["+seq+"]" + " 주문 발송 완료";
			 
    	} else if (code.equals("L5")) {
    		content = "["+seq+"]" + " 주문 입금 완료";
		
    	} else if (code.equals("L6")) {
    		content = "["+seq+"]" + " 계산서 발행 완료";    				 
    	
    	} else if (code.equals("L7")) {
    		content = "["+seq+"]" + " 주문 보류";    				 
    	}
    	
    	Notice notice = new Notice();
    	notice.setUserid(orderDAO.getUserIdByOrderSeq(seq));
    	notice.setOrderSeq(seq);
    	notice.setCompany(orderRequest.getCompany());
    	notice.setUrl(makeUrl(IPUtils.STATIC_SERVER_DOMAIN, orderRequest.getSeq()));
    	notice.setContent(content);
    	List<String> exceptedUserList = new ArrayList<String>();
    	exceptedUserList.add(updateUserid);
    	exceptedUserList.add(orderDAO.getWorker(seq));    	
    	orderForNoticeService.sendNoticeExceptUserList(notice, exceptedUserList);
    }
    
    public void orderConfirmByQRcode(HttpServletRequest request, String orderId, String company, Map<String, Object> result) throws SQLException {
    	Long seq = Long.parseLong(orderId, 10);
    	Order order = orderDAO.getOrder(seq);
    	OrderStatus status = order.getOrder_status();
    	OrderStatus nextStatus = null;
    	
    	if (status.getCode().equals(OrderStatus.L4.getCode()) || status.getCode().equals(OrderStatus.L5.getCode())) {
    		nextStatus = OrderStatus.L5;
    	} else {
    		nextStatus = OrderStatus.L4;
    	}
    	
    	OrderRequest orderRequest = new OrderRequest();
    	orderRequest.setSeq(seq);
    	orderRequest.setOrder_status(nextStatus);
    	orderRequest.setCompany(company);
    	changeOrderStatus(request, orderRequest, "");
    	
    	result.put("title", getTitle(order));
    	result.put("status", nextStatus.getText());
    }
    
    public void setTitle(Order order) {
		order.setTitle(getTitle(order));		
	}
    
    private String getTitle(Order order) {
    	List<String> strArr = new ArrayList<String>();
    	checkAndAddToArray(strArr, order.getItem());
    	checkAndAddToArray(strArr, order.getShape());
    	checkAndAddToArray(strArr, order.getProcess());
    	checkAndAddToArray(strArr, order.getBackground());
    	checkAndAddToArray(strArr, order.getWidth());
    	checkAndAddToArray(strArr, order.getHeight());
    	checkAndAddToArray(strArr, order.getDepth());
    	checkAndAddToArray(strArr, order.getCount());
    	return StringUtils.join(strArr, '-');
    };
    
    private void checkAndAddToArray (List<String> strArr, String value) {
    	if (!StringUtils.isEmpty(value)) {
    		strArr.add(value);
    	}
    }
    
    /*담당자를 불러온다*/
    public Map<String, Object> getWorkers() {
    	Map<String, Object> result = Maps.newHashMap();
    	
    	List<Worker> adminList = userMapper.getWorkers("ADMIN");
    	List<Worker> salesList = userMapper.getWorkers("BUMA_SALES");
    	List<Worker> designerList = userMapper.getWorkers("BUMA_DESIGNER");
    	List<Worker> pmList = userMapper.getWorkers("BUMA_PM");
    	List<Worker> outsourcingList = userMapper.getWorkers("OUTSOURCING");
    	
//    	result.put("admin", adminList);
    	result.put("sales", salesList);
    	result.put("designer", designerList);
//    	result.put("pm", pmList);
//    	result.put("outsourcing", outsourcingList);
    	return result;
    }
    
    public List<Integer> insertMultiOrder (List<Map<String, Object>> orderList, String userid) throws SQLException {
    	List<Integer> resultList =  Lists.newArrayList();
    	
    	for (Map<String, Object> orderMap : orderList) {
    		
    		final ObjectMapper mapper = new ObjectMapper(); // jackson's object mapper
    		final OrderRequest order = mapper.convertValue(orderMap, OrderRequest.class);
    		
    		order.setUserid(userid);
    		int seq = insertOrder(order);
    		resultList.add(seq);
    	}
    	
    	return resultList;
    }
    
    public String makeUrl(String hostname, long seq) {
    	return hostname + "/#orderDetail?seq="+ seq;
    }
//    public String makePathname(long seq) {
//    	String url = "/#orderDetail?seq="+ seq;
//    	return url;
//    }
    

	public void setStatusName(Order order) {
		OrderStatus status = order.getOrder_status();
		order.setOrder_status_name(status.getText());
	}
	
	public List<OrderByTeam> sortOrderByTeam(List<Order> orderList) {
		List<OrderByTeam> resultList = Lists.newArrayList();
		Team[] teamList = Team.values();
		
		for (int i = 0, size = teamList.length; i < size; i++) {
			Team team = teamList[i];
			String teamName = team.getTeam();
			OrderByTeam orderByTeam = new OrderByTeam();
			orderByTeam.setTeam(teamName);
			orderByTeam.setLocation(team.getLocation());
			List<Order> orderListByTeam = Lists.newArrayList();
			
			for(int j = 0; j < orderList.size(); j++) {
				Order order = orderList.get(j);
				if (teamName.equals(order.getTeam())) {
					orderListByTeam.add(order);
					orderList.remove(j);
					j -= 1;
				}
			}
			
			orderByTeam.setOrderList(orderListByTeam);
			resultList.add(orderByTeam);
		}
		
		return resultList;
	}
	
	public Map<String, Object> loadPastOrder(int page, String company, String userId) throws SQLException {
		Pagable pagable = new Pagable();
		pagable.setUserid(userId);
		pagable.setCompany(company);
		
		int totalCount = orderDAO.getTotalCountById(pagable);
		pagable.setTotalCount(totalCount);
		pagable.setPage(page);
		
		List<Order> orderList = orderDAO.getPastOrderById(pagable);
		setPastOrderListDate(orderList);
		
		Map<String, Object> result = Maps.newHashMap();
		result.put("pastOrderList", orderList);
		result.put("lastPage", pagable.getLastPage());
		return result;
	}
	
	private void setPastOrderListDate(List<Order> orderList){
		for(int cnt = 0; cnt < orderList.size(); cnt++){
			String originalStrCreateDate = orderList.get(cnt).getRegistered();
			String originalStrDate = "";
			originalStrDate = originalStrCreateDate;
			String year = originalStrDate.substring(0,4);
			String month = originalStrDate.substring(5,7);
			String day = originalStrDate.substring(8,10);
//			String hour =  originalStrDate.substring(11,13);
//			String minutes =  originalStrDate.substring(14,16);
			String newStrDate = year + "." + month + "."+day;
			orderList.get(cnt).setRegistered(newStrDate);
		}
	}

	public void setStatusDate(Order order) throws Exception {
		long seq = order.getSeq();		
		OrderForStats orderForStats = orderForStatsService.getOrder(seq);
		
		if (orderForStats == null) {
			return;
		}
		
		order.setDesigned(orderForStats.getDesigned());
		order.setProduced(orderForStats.getProduced());
		order.setDelivered(orderForStats.getDelivered());		
	}
	
	public void delete(long seq) throws SQLException {
		orderDAO.deleteOrder(seq);
		orderForStatsDAO.deleteOrder(seq);
	}
	
	public int getCurrentPageBySeq(Pagable pagable) throws SQLException {
		String searchType = pagable.getSearchType();
		int page = 0;
		if (StringUtils.isNotEmpty(searchType) && searchType.equals("content")) {
			page = orderDAO.getCurrentPageBySeqHasContent(pagable);
		} else {
			page = orderDAO.getCurrentPageBySeq(pagable);
		}
		
		return page / 10 + 1;
	}
	
	public void updateSheetNo(HashMap<String, Object> map) throws SQLException {
		// TODO Auto-generated method stub
		orderDAO.updateSheetNo(map);
	}
	
}