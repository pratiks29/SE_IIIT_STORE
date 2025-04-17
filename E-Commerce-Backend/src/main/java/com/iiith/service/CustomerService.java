package com.iiith.service;

import java.util.List;

import com.iiith.exception.CustomerException;
import com.iiith.exception.CustomerNotFoundException;
import com.iiith.models.Address;
import com.iiith.models.CreditCard;
import com.iiith.models.Customer;
import com.iiith.models.CustomerDTO;
import com.iiith.models.CustomerUpdateDTO;
import com.iiith.models.Order;
import com.iiith.models.SessionDTO;

public interface CustomerService {
	
	public Customer addCustomer(Customer customer) throws CustomerException;
	
	public Customer getLoggedInCustomerDetails(String token) throws CustomerNotFoundException;
	
	public List<Customer> getAllCustomers(String token) throws CustomerNotFoundException;
	
	public Customer updateCustomer(CustomerUpdateDTO customer, String token) throws CustomerNotFoundException;
	
	public Customer updateCustomerMobileNoOrEmailId(CustomerUpdateDTO customerUpdateDTO, String token) throws CustomerNotFoundException;
	
	public Customer updateCreditCardDetails(String token, CreditCard card) throws CustomerException;
	
	public SessionDTO updateCustomerPassword(CustomerDTO customerDTO, String token) throws CustomerNotFoundException;
	
	public SessionDTO deleteCustomer(CustomerDTO customerDTO, String token) throws CustomerNotFoundException;
	
	public Customer updateAddress(Address address, String type, String token) throws CustomerException;
	
	public Customer deleteAddress(String type, String token) throws CustomerException, CustomerNotFoundException;

	public List<Order> getCustomerOrders(String token) throws CustomerException; 

}
