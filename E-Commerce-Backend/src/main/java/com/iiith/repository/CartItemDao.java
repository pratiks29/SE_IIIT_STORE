package com.iiith.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.iiith.models.CartItem;

public interface CartItemDao extends JpaRepository<CartItem, Integer>{

}
