package net.fe.buma.order.mybatis;

import net.fe.buma.order.model.Order;
import net.fe.buma.order.model.OrderRequest;
import net.fe.buma.order.model.OrderSummary;
import net.fe.buma.order.model.Worker;
import net.fe.buma.support.paging.Pagable;
import net.fe.buma.user.model.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface OrderMapper {

    @Select("SELECT `seq`, `userid`, `order_status`, `item`, `item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`," +
            "  `sender_address`, `sender_name`, `sender_phone`, `depositor`, `bill`, `business_num`, `business_tel`, `business_email`, `receipts_tel`,`workerid`, `description`, `team`, `outlet`," +
            "  `outlet_detail`, `invoice_info`, `invoice_number`, `registered`, `modified` " +
            "FROM `order` " +
            "ORDER BY seq DESC " + 
            "LIMIT ${offset}, ${pageSize}")
    List<Order> getOrders(Pagable pagable);

    @Select("SELECT count(1) FROM `order`")
    long getCount();
    
    @Select("SELECT `seq`, `userid`, `order_status`, `item`, `item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`," +
            "  `sender_address`, `sender_name`, `sender_phone`,`depositor`,`bill`,`business_num`, `business_tel`, `business_email`, `receipts_tel`, `workerid`, `description`, `team`, `outlet`," +
            "  `outlet_detail`, `invoice_info`, `invoice_number`, `registered`, `modified`" +
            " FROM `order` " + 
            " WHERE `order_status` = '${status}'" +
            " ORDER BY seq DESC LIMIT ${offset}, ${pageSize}")
    List<Order> getOrdersByStatus(Pagable pagable);
    
    @Select("SELECT count(1) FROM `order` WHERE order_status = #{status}")
    long getCountByStatus(String status);

    @Select("SELECT `seq`, `userid`, `order_status`, `item`, `item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`, " +
    		" `sender_address`, `sender_name`, `sender_phone`,`depositor`, `bill`, `business_num`, `business_tel`, `business_email`, `receipts_tel`, `workerid`, `description`, `team`, `outlet`, `unitprice`, `purchaseprice`, " +
            "  `outlet_detail`, `invoice_info`, `invoice_number`, `registered`, `modified`" +
            " FROM `order` " +
            " WHERE userid = #{user.userId} " + 
            " ORDER BY seq DESC")
    List<Order> getUserOrders(User user);

    @Select("SELECT `seq`, `userid`, `order_status`, `item`, `item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`," +
            "  `sender_address`, `sender_name`, `sender_phone`,`depositor`, `bill`, `business_num`, `business_tel`, `business_email`, `receipts_tel`, `workerid`, `description`, `team`, `outlet`, `unitprice`, `purchaseprice`, " +
            "  `outlet_detail`, `invoice_info`, `invoice_number`, `registered`, `modified`" +
            " FROM `order` " + 
            " WHERE seq = #{seq}")
    Order getOrder(long seq);

    @Insert("insert INTO `b2b`.`order`" +
            "	( `order_status`, `userid`, `item`, `item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`," +
            "	`sender_address`, `sender_name`, `sender_phone`,`depositor`, `bill`, `business_num`, `business_tel`, `business_email`, `receipts_tel`, `workerid`, `description`, `team`, `outlet`, `unitprice`,`purchaseprice`, " +
            "	`outlet_detail`,`invoice_info`, `invoice_number`, `registered`, `modified`)" +
            " VALUES ( #{order_status}, #{userid}, #{item}, #{item_code}, #{shape}, #{process}, #{background}, #{width}, #{height}, #{depth}, #{count}, #{price},#{purchase_price}," +
            "	#{sender_address}, #{sender_name}, #{sender_phone}, #{depositor}, #{bill}, #{business_num}, #{business_tel}, #{business_email}, #{receipts_tel}, #{workerid}, #{description}, #{team}, #{outlet}, " +
            "	#{outlet_detail}, #{invoice_info},#{invoice_number}, now(), now()) " +
            " ON DUPLICATE KEY UPDATE " +
            "	`order_status` = #{order_status}, `userid` = #{userid}, `item` = #{item}, `item_code` = #{item_code} , `shape` = #{shape}, `process` = #{process}, `background` = #{background}, `width` = #{width}," +
            "   `height` = #{height}, `depth` = #{depth}, `count` = #{count}, `price` = #{price}, `purchase_price` = #{purchase_price}, `sender_address` = #{sender_address}, `unitprice` = #{unitprice},`purchaseprice` = #{purchaseprice}," +
            "   `sender_name` = #{sender_name}, `sender_phone` = #{sender_phone}, `depositor`=#{depositor}, `bill`=#{bill} , `business_num` = #{business_num}, `business_tel` = #{business_tel}, `business_email` = #{business_email}, `receipts_tel`=#{receipts_tel} ,`workerid` = #{workerid}, `description` = #{description}," +
            "   `team` = #{team}, `outlet` = #{outlet}, `outlet_detail` = #{outlet_detail}, `invoice_info`=#{invoice_info},`invoice_number`=#{invoice_number}, `modified` = now();")
    void upsertOrder(OrderRequest orderRequest);


    @Insert("update `order` SET " +
            "	`order_status` = #{order_status}, `userid` = #{userid}, `item` = #{item}, `item_code` = #{item_code}, `shape` = #{shape}, `process` = #{process}, `background` = #{background}, `width` = #{width}, `height` = #{height}," +
            "	`depth` = #{depth}, `count` = #{count}, `price` = #{price},`purchase_price` = #{purchase_price}, `sender_address` = #{sender_address}, `sender_name` = #{sender_name}, `unitprice` = #{unitprice}, `purchaseprice` = #{purchaseprice}," +
            "	`sender_phone` = #{sender_phone}, `depositor`=#{depositor}, `bill`=#{bill} , `business_num` = #{business_num}, `business_tel` = #{business_tel}, `business_email` = #{business_email}, `receipts_tel`=#{receipts_tel}, `workerid` = #{workerid}, `description` = #{description}, `team` = #{team}," +
            "   `outlet` = #{outlet}, `outlet_detail` = #{outlet_detail}, `invoice_info` = #{invoice_info},`invoice_number` = #{invoice_number}, `modified` = now()" +
            " WHERE `seq` = #{seq};")
    void updateOrder(OrderRequest orderRequest);

    @Insert("update `order` SET " +
            "	`order_status` = #{order_status}, `modified` = now()" +
            "WHERE `seq` = #{seq};")
    void updateOrderStatus(OrderRequest orderRequest);

    @Insert("insert INTO `b2b`.`order`" +
            "	( `order_status`, `userid`, `item`,`item_code`, `shape`, `process`, `background`, `width`, `height`, `depth`, `count`, `price`,`purchase_price`," +
            "   `sender_address`, `sender_name`, `sender_phone`, `depositor`, `bill`, `business_num`, `business_tel`, `business_email`, `receipts_tel`,`workerid`, `description`, `team`, `unitprice`,`purchaseprice` " +
            "	`outlet`, `outlet_detail`, `invoice_info`, `invoice_number`, `registered`, `modified`)" +
            " VALUES (" +
            "	#{order_status}, #{userid}, #{item}, #{item_code} , #{shape}, #{process}, #{background}, #{width}, #{height}, #{depth}, #{count}, #{price}, #{purchase_price}, " +
            "   #{sender_address}, #{sender_name}, #{sender_phone}, #{depositor}, #{bill}, #{business_num}, #{business_tel}, #{business_email}, #{receipts_tel}, #{workerid}, #{description}, #{team}, #{unitprice},#{purchaseprice} " +
            "	#{outlet}, #{outlet_detail}, #{invoice_info}, #{invoice_number}, now(), now());")
    void insertOrder(OrderRequest orderRequest);
    //입금완료 L5 , 계산서 발행 L6 
    @Select("SELECT " +
            "count(case when order_status = 'L1' then 1 END) as l1," +
            "count(case when order_status = 'L2' then 1 END) as l2," +
            "count(case when order_status = 'L3' then 1 END) as l3," +
            "count(case when order_status = 'L4' then 1 END) as l4," +
            "count(case when order_status = 'L5' then 1 END) as l5," +
            "count(case when order_status = 'L6' then 1 END) as l6" +
            "count(case when order_status = 'L7' then 1 END) as l7" +
            "count(case when order_status = 'L8' then 1 END) as l8" +
            " FROM `order`")
    OrderSummary getOrderSummary();
    
    @Select("SELECT * FROM `b2b`.`order` " +
    		" WHERE  registered like CONCAT('%', #{Date}, '%');")
    List<OrderRequest> getOrderByDate(String Date);
    
    @Select("SELECT userid FROM `b2b`.`order` " +
    		" WHERE seq = #{order_seq};")
    String getUserIdByOrderSeq(long order_seq);
    
    @Select("SELECT workerid FROM `b2b`.`order` " +
    		" WHERE seq = #{order_seq};")
    String getDesinerId(long order_seq);
    
    @Select("SELECT * FROM `b2b`.`order` " +
    		" WHERE  registered like CONCAT('%', #{Date}, '%') " + 
    		" AND userid = #{userId};")
    List<OrderRequest> getOrderByDateAndId(@Param("Date") String Date,@Param("userId") String userId);
    
    @Insert(" UPDATE `order` SET " +
    		 "	`item` = #{item}, `item_code` = #{item_code}, `shape` = #{shape}, `process` = #{process}, `background` = #{background}, `width` = #{width}, `height` = #{height}," +
             "	`depth` = #{depth}, `count` = #{count}, `price` = #{price},`purchase_price` = #{purchase_price}, `sender_address` = #{sender_address}, `sender_name` = #{sender_name}, `unitprice` = #{unitprice}, `purchaseprice` = #{purchaseprice}, `unitprice_georise` = #{unitprice_georise}," +
             "	`sender_phone` = #{sender_phone}, `depositor`=#{depositor}, `bill`=#{bill} ,`business_num` = #{business_num}, `business_tel` = #{business_tel}, `business_email` = #{business_email}, `receipts_tel`=#{receipts_tel},`description` = #{description}, `team` = #{team}," +
             "   `outlet` = #{outlet}, `outlet_detail` = #{outlet_detail}, `invoice_info` = #{invoice_info}, `invoice_number` = #{invoice_number}, `modified` = now()" +
             " WHERE `seq` = #{seq};")
    boolean submitModifyOrder(Order order);
}
