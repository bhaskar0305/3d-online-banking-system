package com.bank.controller;

import com.bank.entity.*;
import com.bank.payload.*;
import com.bank.repository.*;
import com.bank.security.jwt.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          RoleRepository roleRepository, AccountRepository accountRepository,
                          PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 1. Create and Save New User Entity
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setFullName(registerDto.getFullName());
        user.setPhoneNumber(registerDto.getPhoneNumber());

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Default User Role not found in database."));
        user.setRoles(Collections.singleton(userRole));

        User savedUser = userRepository.save(user);

        // 2. Auto-Generate Associated Bank Account with 10-Digit Number & Card Security Attributes
        Account account = new Account();
        
        // Standardized 10-Digit Account Number starting with 100
        account.setAccountNumber("100" + String.format("%07d", new Random().nextInt(10000000)));
        account.setBalance(new BigDecimal("1000.00")); // Initial balance credit
        account.setAccountType("SAVINGS");
        account.setStatus("ACTIVE");
        
        // Set User Security PIN, Expiry, and CVV
        account.setCardPin(registerDto.getCardPin() != null && registerDto.getCardPin().length() == 4 
                ? registerDto.getCardPin() : "1234");
        account.setExpiryDate("08/29");
        account.setCvv(String.format("%03d", new Random().nextInt(1000)));
        account.setUser(savedUser);

        accountRepository.save(account);

        return ResponseEntity.ok("User registered successfully! Primary bank account generated.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        String jwt = jwtUtils.generateToken(authentication.getName());
        return ResponseEntity.ok(new JwtAuthResponse(jwt));
    }
}