package com.bank.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AccountResponse {
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String ownerName;
    private String cardPin;
    private String expiryDate;
    private String cvv;
}