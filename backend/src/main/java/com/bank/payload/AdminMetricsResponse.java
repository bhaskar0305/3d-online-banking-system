package com.bank.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AdminMetricsResponse {
    private long totalUsers;
    private long totalAccounts;
    private BigDecimal totalSystemLiquidity;
    private long totalTransactionsCount;
}