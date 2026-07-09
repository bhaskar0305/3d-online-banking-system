package com.bank.controller;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.payload.AdminMetricsResponse;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AdminController(UserRepository userRepository, 
                           AccountRepository accountRepository, 
                           TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    // 1. Get System-wide Auditing Metrics
    @GetMapping("/metrics")
    public ResponseEntity<?> getSystemMetrics() {
        long totalUsers = userRepository.count();
        List<Account> accounts = accountRepository.findAll();
        long totalAccounts = accounts.size();

        BigDecimal totalLiquidity = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalTransactions = transactionRepository.count();

        return ResponseEntity.ok(new AdminMetricsResponse(
                totalUsers,
                totalAccounts,
                totalLiquidity,
                totalTransactions
        ));
    }

    // 2. List All Customer Accounts
    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    // 3. Toggle Account Status (ACTIVE / FROZEN)
    @PutMapping("/accounts/{id}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long id, @RequestParam String status) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found."));

        account.setStatus(status.toUpperCase());
        accountRepository.save(account);

        return ResponseEntity.ok("Account " + account.getAccountNumber() + " status updated to: " + account.getStatus());
    }

    // 4. Audit All System Transactions
    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return ResponseEntity.ok(transactions);
    }
}