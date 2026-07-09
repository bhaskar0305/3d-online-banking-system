package com.bank.payload;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String cardPin; // 4-digit PIN set during registration
}