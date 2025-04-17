package com.iiith.service;

import com.iiith.models.CartDTO;
import com.iiith.models.CartItem;

public interface CartItemService {
	
	public CartItem createItemforCart(CartDTO cartdto);
	
}
