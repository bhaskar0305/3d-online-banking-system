package com.bank.payload;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {
    private String targetAccountNumber;
    private BigDecimal amount;
    private String description;
}
