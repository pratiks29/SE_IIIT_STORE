package com.iiith.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iiith.exception.CartItemNotFound;
import com.iiith.exception.CustomerNotFoundException;
import com.iiith.exception.LoginException;
import com.iiith.models.Cart;
import com.iiith.models.CartDTO;
import com.iiith.models.CartItem;
import com.iiith.models.Customer;
import com.iiith.models.UserSession;
import com.iiith.repository.CartDao;
import com.iiith.repository.CustomerDao;
import com.iiith.repository.ProductDao;
import com.iiith.repository.SessionDao;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartDao cartDao;
	
	@Autowired
	private SessionDao sessionDao;
	
	@Autowired
	private CartItemService cartItemService;
	
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private LoginLogoutService loginService;
	
	
	@Autowired
	private ProductDao productDao;

	@Override
	public Cart addProductToCart(CartDTO cartDto, String token) {

		
		if(token.contains("customer") == false) {
			throw new LoginException("Invalid session token for customer");
		}
		
		loginService.checkTokenStatus(token);
		
		UserSession user = sessionDao.findByToken(token).get();
		
		Optional<Customer> opt = customerDao.findById(user.getUserId());
		
		if(opt.isEmpty())
			throw new CustomerNotFoundException("Customer does not exist");
		
		Customer existingCustomer = opt.get();
		
		Cart customerCart = existingCustomer.getCustomerCart();
		
		List<CartItem> cartItems = customerCart.getCartItems();
		
		CartItem item = cartItemService.createItemforCart(cartDto);
		
		
		if(cartItems.size() == 0) {
			cartItems.add(item);
			customerCart.setCartTotal(item.getCartProduct().getPrice());
		}
		else {
			boolean flag = false;
			for(CartItem c: cartItems) {
				if(c.getCartProduct().getProductId() == cartDto.getProductId()) {
					c.setCartItemQuantity(c.getCartItemQuantity() + 1);
					customerCart.setCartTotal(customerCart.getCartTotal() + c.getCartProduct().getPrice());
					flag = true;
				}
			}
			if(!flag) {
				cartItems.add(item);
				customerCart.setCartTotal(customerCart.getCartTotal() + item.getCartProduct().getPrice());
			}
		}
		
		return cartDao.save(existingCustomer.getCustomerCart());
		

}
	
	

	@Override
	public Cart getCartProduct(String token) {
		
		System.out.println("Inside get cart");
		
		if(token.contains("customer") == false) {
			throw new LoginException("Invalid session token for customer");
		}
		
		loginService.checkTokenStatus(token);
		
		UserSession user = sessionDao.findByToken(token).get();
		
		Optional<Customer> opt = customerDao.findById(user.getUserId());
		
		
		if(opt.isEmpty())
			throw new CustomerNotFoundException("Customer does not exist");
		
		Customer existingCustomer = opt.get();
		
//		System.out.println(existingCustomer);
//		
//		System.out.println(existingCustomer.getCustomerCart());
//		
//		System.out.println("Here reached");
//		
		Integer cartId = existingCustomer.getCustomerCart().getCartId();
		
		
		Optional<Cart> optCart= cartDao.findById(cartId);
		
		if(optCart.isEmpty()) {
			throw new CartItemNotFound("cart Not found by Id");
		}
//		return optCart.get().getProducts();
		
		return optCart.get();
//		return cart.getProducts();
	}

	
	
	@Override
	public Cart removeProductFromCart(CartDTO cartDto, String token) {
		if(token.contains("customer") == false) {
			throw new LoginException("Invalid session token for customer");
		}
		
		loginService.checkTokenStatus(token);
		
		UserSession user = sessionDao.findByToken(token).get();
		
		Optional<Customer> opt = customerDao.findById(user.getUserId());
		
		if(opt.isEmpty())
			throw new CustomerNotFoundException("Customer does not exist");
		
		Customer existingCustomer = opt.get();
		
		Cart customerCart = existingCustomer.getCustomerCart();
		
		List<CartItem> cartItems = customerCart.getCartItems();
		
		if(cartItems.size() == 0) {
			throw new CartItemNotFound("Cart is empty");
		}
		
		
		boolean flag = false;
		
		for(CartItem c: cartItems) {
			System.out.println("Item" + c.getCartProduct());
			if(c.getCartProduct().getProductId() == cartDto.getProductId()) {
				c.setCartItemQuantity(c.getCartItemQuantity() - 1);
				
				customerCart.setCartTotal(customerCart.getCartTotal() - c.getCartProduct().getPrice());
				if(c.getCartItemQuantity() == 0) {
					
					cartItems.remove(c);

					
					return cartDao.save(customerCart);
				}
				flag = true;
			}
		}
		
		if(!flag) {
			throw new CartItemNotFound("Product not added to cart");
		}
		
		if(cartItems.size() == 0) {
			cartDao.save(customerCart);
			throw new CartItemNotFound("Cart is empty now");
		}
		
		return cartDao.save(customerCart);
	}
	
	
	
	
	// Method to clear entire cart
	
	@Override
	public Cart clearCart(String token) {
		
		if(token.contains("customer") == false) {
			throw new LoginException("Invalid session token for customer");
		}
		
		loginService.checkTokenStatus(token);
		
		UserSession user = sessionDao.findByToken(token).get();
		
		Optional<Customer> opt = customerDao.findById(user.getUserId());
		
		if(opt.isEmpty())
			throw new CustomerNotFoundException("Customer does not exist");
		
		Customer existingCustomer = opt.get();
		
		Cart customerCart = existingCustomer.getCustomerCart();
		
		if(customerCart.getCartItems().size() == 0) {
			throw new CartItemNotFound("Cart already empty");
		}
		
		List<CartItem> emptyCart = new ArrayList<>();
		
		customerCart.setCartItems(emptyCart);
		
		customerCart.setCartTotal(0.0);
		
		return cartDao.save(customerCart);
	}
	
}
