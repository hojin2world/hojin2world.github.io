 @RequestMapping(value = "/submit", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> requestOrder(User user, @RequestBody OrderRequest orderRequest,HttpSession session , HttpServletResponse response) throws Exception{
    	
    	
    	orderRequest.setUserid(getUserId());
    	int orderSeq = orderService.insertOrder(orderRequest);
        
       SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMddHHmmss");
    	Date time = new Date();
    	String currentTime = format1.format(time);
        
    	JSONArray items = new JSONArray();
    	JSONObject object = new JSONObject();
    	JSONArray orderItems = new JSONArray();
    	JSONObject orderItem = new JSONObject();
    	JSONObject data = new JSONObject();
    	JSONObject tApiData = new JSONObject();
    	
    	String targetURL = "https://test.test.com/delivery/api/v2/orders/partner/[partnerCode]";
    	URL url = null;
    	url = new URL(targetURL);
    	HttpURLConnection urlConn = null;
    	urlConn = (HttpURLConnection)url.openConnection();
    	urlConn.setDoInput(true);
    	urlConn.setDoOutput(true);
    	urlConn.setRequestMethod("POST");
    	urlConn.setRequestProperty("Content-Type", "application/json;charset=utf-8");
    	urlConn.setRequestProperty("test-Api-Key", "[Key-num]");
    	urlConn.setDoOutput(true);
    	urlConn.connect();
    	int count = 10;
    	
    	object.put("transUniqueCd", "b"+orderSeq); //배송고유번호 Y
    	object.put("centerCode","b0001"); //발송지코드
    	object.put("deliveryCode", "HYUNDAI"); //택배사코드
    	object.put("sndName", "companyName"); //발신자(회사명) Y
    	object.put("sndZipCode", "companyZipCode");//발신 우편번호 Y
    	object.put("sndAddr1", "companyAddress");//발신 주소 Y
    	object.put("sndTel1", "companyNum");//발신자 전화번호 Y
    	object.put("rcvName", orderRequest.getSender_name());//수신자 Y
    	object.put("rcvZipCode", orderRequest.getSender_postcode());//수신자 우편번호 Y
    	object.put("rcvAddr1", orderRequest.getSender_address());//수신자 주소1 Y
    	object.put("rcvAddr2", orderRequest.getSender_detailaddress());//수신자 상세주소
    	object.put("rcvTel1", orderRequest.getSender_phone());//수신자 연락처 Y
    	object.put("mallId", "companyB");//해당API 등록된 발신자 id Y
    	object.put("status", "N");
    	object.put("sheetNo", "");//이전 출력 송장번호
    	object.put("paymentTypeCode", "SH");//지불 : 신용 Y
    	object.put("msgToTrans", "");//비고
    	object.put("orderItems", orderItems);//주문품목 
    	orderItems.add(orderItem);
    	orderItem.put("uniqueCd", "b"+orderSeq+"-01");//고객사용번호 Y
    	orderItem.put("ordNo","b"+orderSeq);//주문번호 Y
    	orderItem.put("itemName", orderRequest.getItem());//상품 이름 Y
    	orderItem.put("itemQty", Integer.parseInt(orderRequest.getCount()));//상품 수량 Y
    	orderItem.put("ordDate", currentTime);//주문일자 Y
    	items.add(object);
    	data.put("items", items);
    	tApiData.put("data", data);
    	String resultData = tApiData.toString();;
    	
    	String param = tApiData.toJSONString();
    	
    	OutputStream output = null;
    	output = new DataOutputStream(urlConn.getOutputStream());
    	output.writeBytes(data.toString());
    	output.write(param.getBytes("UTF-8"));
    	output.flush();
    	output.close();
    	System.out.println("--------------------------");
    	System.out.println("param   :   " + param);
    	System.out.println("--------------------------");
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
    	System.out.println("=========response========"+obj.values());
    	System.out.println("=========response========"+responseId);
    	
    	

    	Map<String, Object> result = Maps.newHashMap();
        result.put("seq", orderSeq);
        return getFormattedResult(true, result);
    }