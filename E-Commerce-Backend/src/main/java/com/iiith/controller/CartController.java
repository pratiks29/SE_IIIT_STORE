package com.iiith.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.iiith.models.Cart;
import com.iiith.models.CartDTO;
import com.iiith.models.CartItem;
import com.iiith.repository.CartDao;
import com.iiith.repository.CustomerDao;
import com.iiith.service.CartService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

	@Autowired
	private CartService cartService;
	
	@Autowired
	private CartDao cartDao;
	
	@Autowired
	private CustomerDao customerDao;
	

	@PostMapping(value = "/cart/add")
	public ResponseEntity<Cart> addProductToCartHander(@RequestBody CartDTO cartdto ,@RequestHeader("token")String token){
		
		Cart cart = cartService.addProductToCart(cartdto, token);
		return new ResponseEntity<Cart>(cart,HttpStatus.CREATED);
	}
	
//	
	@GetMapping(value = "/cart")
	public ResponseEntity<Cart> getCartProductHandler(@RequestHeader("token")String token){
		return new ResponseEntity<>(cartService.getCartProduct(token), HttpStatus.ACCEPTED);
	}
	
	
	@DeleteMapping(value = "/cart")
	public ResponseEntity<Cart> removeProductFromCartHander(@RequestBody CartDTO cartdto ,@RequestHeader("token")String token){
		
		Cart cart = cartService.removeProductFromCart(cartdto, token);
		return new ResponseEntity<Cart>(cart,HttpStatus.OK);
	}
	
	
	@DeleteMapping(value = "/cart/clear")
	public ResponseEntity<Cart> clearCartHandler(@RequestHeader("token") String token){
		return new ResponseEntity<>(cartService.clearCart(token), HttpStatus.ACCEPTED);
	}
	
	
}
