package net.fe.buma.stats.model;

import lombok.Data;

@Data
public class OrderForStats {
	long seq;
	String outlet_detail;
	String item;
	String shape;
	String team;
	String userid;
	String username;
	String designer;
	String designername;
	String registered;
	String work_starting_date;
	public boolean adjusted;
	String sampled_first;
	String sampled_first_adjust;	
	public boolean sampled_first_compliance;
	String sampled_first_process_time;
	String deposited;
	String designed;
	String produced;
	String delivered;
	String delivered_adjust;	
	String billed;
	public boolean delivered_compliance;
	String total_process_time;
	
	//join용 변수
	int count;
	int price;
	
	
}