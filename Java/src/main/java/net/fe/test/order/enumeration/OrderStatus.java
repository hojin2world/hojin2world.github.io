package net.fe.buma.order.enumeration;

import net.fe.buma.support.enumeration.CodeEnum;
import net.fe.buma.support.enumeration.TextEnum;

/**
 * Created by han on 15. 1. 18..
 */
public enum OrderStatus implements CodeEnum, TextEnum { //입금완료,계산서발행추가
    L1("L1", "접수"), L2("L2", "디자인"), L3("L3", "제작"), L4("L4", "발송"),  L5("L5", "입금"),L6("L6", "계산서발행"), L7("L7", "보류");

    private String code;
    private String text;

    OrderStatus(String code, String text) {
        this.code = code;
        this.text = text;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getText() {
        return text;
    }
    
    public String getTextByCode(String code) {
    	for(OrderStatus status : OrderStatus.values()) {
    		if (code.equals(status.getCode())) {
    			return status.getText();
    		}
    	}
    	return null;
    }
}
