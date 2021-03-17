---
layout: post
title:  "[Spring] 송장출력 - Json"
categories: spring
comments: true

---

# 송장출력 



<br/>

### 주문데이터 보내기

````java
@RequestMapping(value = "/order/testDelApi")
	public String orderTest(ModelMap model, @ModelAttribute OrderSearchCondition condition,HttpSession session) throws Exception {
        SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMddHHmmss");
    	Date time = new Date();
    	String currentTime = format1.format(time);
		List<Order> resultList = service.getOrderStatsForId(condition);
		JSONArray items = new JSONArray();
    	
    	JSONObject data = new JSONObject();
    	JSONObject delApi = new JSONObject();
    	
  String targetURL ="https://test.delApi.com/delivery/api/v2/orders/partner/partnerCode";
    	URL url = null;
    	url = new URL(targetURL);
    	HttpURLConnection urlConn = null;
    	urlConn = (HttpURLConnection)url.openConnection();
    	urlConn.setDoInput(true);
    	urlConn.setDoOutput(true);
    	urlConn.setRequestMethod("POST");
    	urlConn.setRequestProperty("Content-Type", "application/json;charset=utf-8");
    	urlConn.setRequestProperty("delApi-Api-Key", "[delApi-Api-Key]");
    	urlConn.setDoOutput(true);
    	urlConn.connect();
    	int count = 10;
    	for(int i=0; i<resultList.size(); i++){
		    		JSONObject object = new JSONObject();
		    		JSONArray orderItems = new JSONArray();
		        	JSONObject orderItem = new JSONObject();
		    	object.put("transUniqueCd", resultList.get(i).getSeq());
		    	object.put("centerCode","b0001"); //고정
		    	object.put("deliveryCode", "HYUNDAI"); //고정
		    	object.put("sndName", "회사명"); //고정
		    	object.put("sndZipCode", "012345"); //고정
		    	object.put("sndAddr1", "서울특별시 중구 - ");//고정
		    	object.put("sndTel1", "07043370000");//고정
		    	object.put("rcvName", resultList.get(i).getSender_name());
		    	object.put("rcvZipCode", resultList.get(i).getSender_postcode());
		    	object.put("rcvAddr1", resultList.get(i).getSender_address());
		    	object.put("rcvAddr2", resultList.get(i).getSender_detailaddress());
		    	object.put("rcvTel1", resultList.get(i).getSender_phone());
		    	object.put("mallId", "몰Id"); //고정
		    	object.put("status", "N"); //고정
		    	object.put("paymentTypeCode", "SH"); //입금구분 : 신용 고정
		    	object.put("msgToTrans", "");
		    	object.put("orderItems", orderItems); 
		    	orderItems.add(orderItem);
		    	orderItem.put("uniqueCd", "b"+resultList.get(i).getSeq()+"-01");
		    	orderItem.put("ordNo","b"+resultList.get(i).getSeq());
		    	orderItem.put("itemName", resultList.get(i).getItem());
		    	orderItem.put("itemQty", Integer.parseInt(resultList.get(i).getCount()));
		    	orderItem.put("ordDate", currentTime);
		    	items.add(object);
		    	data.put("items", items);
    	}
    	delApi.put("data", data);
    	String resultData = delApi.toString();
    	
    	String param = delApi.toJSONString();
    	
    	OutputStream output = null;
    	output = new DataOutputStream(urlConn.getOutputStream());
    	output.write(param.getBytes("UTF-8"));
    	output.flush();
    	output.close();

    	System.out.println("param   :   " + param);

    	BufferedInputStream bis = new BufferedInputStream(urlConn.getInputStream());
    	BufferedReader dis = new BufferedReader(new InputStreamReader(bis));
    	
    	int responseCode = urlConn.getResponseCode();
    	BufferedReader br;
    	if(responseCode == 200) {//SUCCESS
    		br = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    		
    	}else { //ERROR
    		br = new BufferedReader(new InputStreamReader(urlConn.getErrorStream()));
    		System.out.println("ERROR");
    	}
    	String inputLine;
    	StringBuffer responses = new StringBuffer();
    	while((inputLine = br.readLine()) != null){
    		responses.append(inputLine);
    	}
    	br.close();
    	System.out.println(responses.toString());
    	
    	JSONParser parser = new JSONParser();
    	JSONObject obj = (JSONObject) parser.parse(responses.toString());
    	obj.values();
    	String responseId= (String) obj.get("id");
    	System.out.println("===============response========"+obj.values());
    	System.out.println("===============response========"+responseId);
		

		System.out.println(resultList);
		model.addAttribute("resultList", resultList);
		session.setAttribute("id", responseId);
		session.setAttribute("resultData", resultData);
		return "stats/testDelApi";
	}	
````

StatsService

````java
	public List<Order> getOrderStatsForPrint(OrderSearchCondition condition) throws Exception {
		List<Order> resultList = statsDao.getOrderStats(condition);
		restructOrderStats(resultList);		
		return resultList;
	}
````

StatsDAO

````java
	public List<Order> getOrderStats(OrderSearchCondition condition) throws SQLException 	{
		return getSql().selectList(NAMESPACE_PREFIX + "getOrderStats", condition);
	}
````

stats.xml

````java
<select id="getOrderStats" parameterType="orderSearchCondition" resultType="order" >
		/* stats.getOrderStats */
		SELECT `seq`, `userid`,`usercode`, `order_status`, `item`,`item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`,
        `support_select`, `design_select`, `sender_postcode`,`sender_address`,`sender_detailaddress`, `sender_name`, `sender_phone`, `workerid`, `description`, `team`, `outlet`, `purchaseprice`,`unitprice`,`designprice`,
        `outlet_detail`, `outlet_detail_code`, `fromDate`, `invoice_info`, `invoice_number`,`uniquecd`, `registered`, `modified`, `company`
        FROM `order`
    WHERE date_format(`registered`, '%Y-%m-%d') BETWEEN #{fromDate} AND #{toDate} 
		AND `company` = #{company}
		<if test="orderStatus != null and orderStatus != ''">
		AND order_status = #{orderStatus}
		</if>
		<if test="item != null and item != ''">
		AND item = #{item}
		</if>
		<if test="isCompanyEmployee">
		AND `userid` = #{userid}
		</if>
		<if test="userid != null and userid != ''">
		AND `userid` = #{userid}
		</if>
		<if test="team != null and team != ''">
		AND team = #{team}
		</if>
		<if test="outlet != null and outlet != ''">
		AND outlet = #{outlet}
		</if>
		<if test="outlet_detail != null and outlet_detail != ''">
		AND outlet_detail = #{outlet_detail}
		</if>
		<if test="isUnitZero">
		AND count = 0
		</if>
		<if test="isPriceZero">
		AND price = 0
		</if>
	</select>
````





<br/>

### OTP 발급받기


```java
@RequestMapping(value = "/order/getList", method = {RequestMethod.POST,RequestMethod.GET})
	@ResponseBody	
	public Map<String, Object> getOrder(ModelMap model,@ModelAttribute OrderSearchCondition condition , HttpSession session) throws Exception {
		
		Map<String, Object> result = Maps.newHashMap();
		String customer = condition.getCustomer();
		if (StringUtils.isNotEmpty(customer)) {
			String userid = userMapper.getIdByName(customer);
			condition.setUserid(userid);
		}
		
		if (userService.isCompanyStaff(getUserId())) {
			condition.setUserid(getUserId());
		}
		boolean isSuccess = service.getOrderStats(result, condition);
		System.out.println(condition);
		model.addAttribute("resultList", service.getOrderStatsForPrint(condition));
		System.out.println(service.getOrderStatsForPrint(condition));
		System.out.println(service.getOrderStats(result, condition));
		String targetURL = "https://test.delApi.com/del/api/v2/otps/partner/partnerCode";
    	URL url = null;
    	url = new URL(targetURL);
    	HttpURLConnection urlConn = null;
    	urlConn = (HttpURLConnection)url.openConnection();
    	urlConn.setDoInput(true);
    	urlConn.setDoOutput(true);
    	urlConn.setRequestMethod("POST");
    	urlConn.setRequestProperty("Accept", "application/json");
    	urlConn.setRequestProperty("Content-Type", "application/json;charset=utf-8");
    	urlConn.setRequestProperty("delApi-Api-Key", "[delApi-Api-Key]");
    	urlConn.setDoOutput(true);
    	urlConn.connect();
		
    	OutputStream output = null;
    	output = new DataOutputStream(urlConn.getOutputStream());
    	output.writeBytes(data.toString());
    	output.write(targetURL.getBytes("UTF-8"));
    	output.flush();
    	output.close();

    	DataInputStream input = new DataInputStream(urlConn.getInputStream());
    	BufferedInputStream bis = new BufferedInputStream(urlConn.getInputStream());
    	BufferedReader dis = new BufferedReader(new InputStreamReader(bis));
    	
    	int responseCode = urlConn.getResponseCode();
    	BufferedReader br;
    	if(responseCode == 200) {//SUCCESS
    		br = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    		
    	}else { //ERROR
    		br = new BufferedReader(new InputStreamReader(urlConn.getErrorStream()));
    		System.out.println("ERROR");
    	}
    	String inputLine;
    	StringBuffer response = new StringBuffer();
    	while((inputLine = br.readLine()) != null){
    		response.append(inputLine);
    	}
    	br.close();
    	System.out.println(response.toString());
    	
    	JSONParser parser = new JSONParser();
    	JSONObject obj = (JSONObject) parser.parse(response.toString());
    	obj.values();
    	String otpData = (String) obj.get("data");
    	System.out.println(obj.values());
    	System.out.println(otpData);
    	
    	condition.setOtp(otpData);
    	System.out.println(condition.getOtp());
    	session.setAttribute("OTP", otpData);
        
		return getFormattedResult(true, result);
	}

```
````java
	public List<Order> getOrderStatsForPrint(OrderSearchCondition condition) throws Exception {
		List<Order> resultList = statsDao.getOrderStats(condition);
		restructOrderStats(resultList);		
		return resultList;
	}
````



<br/>

### 송장 받아오기

```java
@RequestMapping(value = "/order/responseSheetNo",  method=RequestMethod.POST)
	public @ResponseBody JSONObject responseSheetNo(@RequestBody HashMap<String,Object> data) throws IOException, ParseException,Exception  {
		 
	  	 JsonParser jsonParser = new JsonParser();
	  	 JsonElement jelement = new JsonParser().parse(data.toString());
	  	 JsonObject jObject = jelement.getAsJsonObject(); 
	  	 //delApi에서 보내는 JSON data
	  	 jObject = jObject.getAsJsonObject("data");
	  	 //JSON data 안에 들어있는 items
	  	 JsonArray jsonArray = jObject.getAsJsonArray("items");
	  	 Order order = new Order();
	  	 //items안에 uniqueCd로 구분 items안에 Array 갯수만큼 가져옴
	  	 
	  	for(int i=0; i<jsonArray.size(); i++){ 		 	
	   	 jObject = jsonArray.get(i).getAsJsonObject();
	  	 String sheetNo = jObject.get("sheetNo").toString();
	  	 String deliverCode = jObject.get("deliverCode").toString().replaceAll("\"", "");
	  	 String uniqueCd = jObject.get("uniqueCd").toString().replaceAll("\"", "");  	 
	
         int transUniqueCd = Integer.parseInt(jObject.get("transUniqueCd").toString()); 
		 System.out.println("---------"+uniqueCd.replaceAll("\"", ""));		
		    
		     HashMap<String, Object> map = new HashMap<String, Object>();
		     map.put("deliverCode", deliverCode);
		     map.put("sheetNo", sheetNo);
		     map.put("transUniqueCd", transUniqueCd);
		     map.put("uniqueCd", uniqueCd);
		     
		     orderService.updateSheetNo(map);
	  	}
	  	 
		  JSONObject map = new JSONObject();
		    map.put("success", true);
		    map.put("message", "전송완료");
	    
	  	return  map;
}
```
<br/>

### 송장 출력 페이지 호출

````java
@RequestMapping(value = "/order/invoicePrint")
	public String orderPrint(ModelMap model,HttpSession session)
			 throws Exception {
		session.getAttribute("id");
		session.getAttribute("OTP");
		session.setAttribute("responseURL", "result");
	
        String url = "https://test.delApi.com/print/송장출력.aspx";
        String urlParameters = "?id="+id
                +"&OTP="+otp+"&responseURL="+responseURL;
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        //add reuqest header
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        con.setRequestProperty("delApi-Api-Key", "[delApi-Api-Key]");
        // Send post request
        con.setDoOutput(true);              //항상 갱신된내용을 가져옴.
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + urlParameters);
        System.out.println("Response Code : " + responseCode);

        Charset charset = Charset.forName("UTF-8");
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(),charset));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        System.out.println(response.toString());
		session.setAttribute("body", response.toString());*/
        return "stats/invoicePrint";
		
		String id = (String) session.getAttribute("id");
		String otp = (String) session.getAttribute("otp");
		String responseURL = "http://test.com/stats/order/responseSheetNo";
		URL url = new URL("https://test.delApi.com/print/송장출력.aspx?"); // 호출할 url
        Map<String,Object> params = new LinkedHashMap<>(); // 파라미터 세팅
        params.put("id", "id");
        params.put("otp", "otp");
        params.put("responseURL", responseURL);
 
        StringBuilder postData = new StringBuilder();
        for(Map.Entry<String,Object> param : params.entrySet()) {
            if(postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");
 
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setRequestProperty("delApi-Api-Key", "[delApi-Api-Key]");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes); // POST 호출
 
		BufferedReader in = new BufferedReader(new 				                        InputStreamReader(conn.getInputStream(), "UTF-8"));
 
        String inputLine;
        while((inputLine = in.readLine()) != null) { // response 출력
            System.out.println(inputLine);
        }
 
        in.close();


		model.addAttribute("resultList", service.getOrderStatsForPrint(condition));
		return "stats/print";
	}
````

<br/>

### getFormattedResult

````java
public class CommonController {
	
	@Autowired
    UserService userService;

    public Map<String, Object> getFormattedResult(boolean success, Object result){
        HashMap<String, Object> returnMap = Maps.newHashMap();
        returnMap.put("returnValue", result);
        returnMap.put("success", success);
        return returnMap;
    }
}
````

