package com.bank.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AccountResponse {
    private String accountNumebr;
    private String accountType;
    private BigDecimal balance;
    private String ownerName;
}
