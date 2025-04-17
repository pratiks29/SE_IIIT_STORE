package com.iiith.service;

import com.iiith.models.CustomerDTO;
import com.iiith.models.SellerDTO;
import com.iiith.models.SessionDTO;
import com.iiith.models.UserSession;


public interface LoginLogoutService {
	
	public UserSession loginCustomer(CustomerDTO customer);
	
	public SessionDTO logoutCustomer(SessionDTO session);
	
	public void checkTokenStatus(String token);
	
	public void deleteExpiredTokens();
	
	
	public UserSession loginSeller(SellerDTO seller);
	
	public SessionDTO logoutSeller(SessionDTO session);
	
	
}
