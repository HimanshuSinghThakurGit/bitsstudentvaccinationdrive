package com.bits.vaccinationdrive.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.bits.vaccinationdrive.model.User;
import com.bits.vaccinationdrive.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.http.HttpSession;
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	 @Autowired
	    private UserRepository userRepository;

	    @PostMapping("/login")
	    public Map<String, Object> login(@RequestParam String username, @RequestParam String password, HttpSession session) {
	        Map<String, Object> response = new HashMap<>();
	        User user = userRepository.findByUsername(username).orElse(null);

	        if (user != null && user.getPassword().equals(password)) {
	        	 session.setAttribute("username", username);
	             session.setAttribute("role", "admin");
	        	response.put("status", "success");
	            response.put("role", user.getRole());
	            response.put("message", "Login successful");
	        } else {
	            response.put("status", "error");
	            response.put("message", "Invalid credentials");
	        }

	        return response;
	    }
	    
	    @PostMapping("/logout")
	    public Map<String, Object> logout(HttpSession session) {
	        session.invalidate();
	        Map<String, Object> response = new HashMap<>();
	        response.put("status", "success");
	        response.put("message", "Logout successful");
	        return response;
	    }

	    @GetMapping("/session")
	    public Map<String, Object> checkSession(HttpSession session) {
	        Map<String, Object> response = new HashMap<>();
	        Object username = session.getAttribute("username");
	        if (username != null) {
	            response.put("status", "active");
	            response.put("username", username);
	            response.put("role", session.getAttribute("role"));
	        } else {
	            response.put("status", "inactive");
	        }
	        return response;
	    }
}
