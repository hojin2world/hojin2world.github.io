

@Controller
@Slf4j
@RequestMapping("/stats")
public class StatsController extends CommonController{
	
	@Autowired
	StatsService service;
	
	Order order;
	
    @Autowired
    OrderService orderService;
    
	@Autowired
	UserService userService;
	
	@Autowired
	UserMapper userMapper;
	
	@Autowired
	OrderController orderController;

	
	@RequestMapping(value = "/order/getList", method = {RequestMethod.POST,RequestMethod.GET})
	@ResponseBody	
	public Map<String, Object> getOrder(@ModelAttribute OrderSearchCondition condition , HttpSession session) throws Exception {
		
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
        /*배송연동 API - OTP 발급받기*/
		String targetURL = "https://test.test.com/delivery/api/v2/otps/partner/[partnerCode]";
    	URL url = null;
    	url = new URL(targetURL);
    	HttpURLConnection urlConn = null;
    	urlConn = (HttpURLConnection)url.openConnection();
    	urlConn.setDoInput(true);
    	urlConn.setDoOutput(true);
    	urlConn.setRequestMethod("POST");
    	urlConn.setRequestProperty("Accept", "application/json");
    	urlConn.setRequestProperty("Content-Type", "application/json;charset=utf-8");
    	urlConn.setRequestProperty("Api-Key", "[Key-Num]");
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
    	System.out.println("===============response========"+obj.values());
    	System.out.println(+otpData);
    	
    	condition.setOtp(otpData);
    	System.out.println(condition.getOtp());
    	session.setAttribute("OTP", otpData);
		
		return getFormattedResult(true, result);
	}

	
