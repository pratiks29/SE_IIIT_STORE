package com.iiith.service;

import java.util.List;

import com.iiith.controller.ProductNotFound;
import com.iiith.exception.CartItemNotFound;
import com.iiith.models.Cart;
import com.iiith.models.CartDTO;
import com.iiith.models.CartItem;




public interface CartService {
	
	public Cart addProductToCart(CartDTO cart, String token) throws CartItemNotFound;
	public Cart getCartProduct(String token);
	public Cart removeProductFromCart(CartDTO cartDto,String token) throws ProductNotFound;
//	public Cart changeQuantity(Product product,Customer customer,Integer quantity);
	
	public Cart clearCart(String token);
	
}
