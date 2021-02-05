package net.fe.buma.order.model;

import lombok.Data;
import net.fe.buma.order.enumeration.OrderStatus;

@Data
public class Order {
    long seq;
    OrderStatus order_status = OrderStatus.L1;
    String order_status_name;
    String userid;
    String username;
    String title;
    String workerid;
    String description;
    //User user
    //User worker;
    String item;
    String item_code;
    String shape;
    String process;
    String background;
    String background_id;
    String width;
    String height;
    String depth;
    String count;
    String price;
    String purchase_price;//매입총액
    String unitprice;
    String purchaseprice; //매입가
    String unitprice_georise;
    String sender_postcode;
    String sender_address;
    String sender_detailaddress;
    String sender_name;
    String sender_phone;
    String depositor; //입금자
    String bill; //세금계산서 선택
    String business_num;//사업자번호
    String business_tel;//대표번호
    String business_email;//이메일
    String receipts_tel; //현금영수증/사업자 발행 번호
    String team;
    String outlet;
    String outlet_detail;
    String registered;
    String modified;
    String company;
    String designed;
    String produced;
    String delivered;
    long past_odr;
    String invoice_info;
    String invoice_number;
    String uniquecd;
    String transuniquecd;
    
    String worker_name;
}
