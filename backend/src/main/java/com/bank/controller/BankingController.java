package com.bank.controller;

import com.bank.entity.*;
import com.bank.payload.*;
import com.bank.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/banking")
@CrossOrigin(origins = "*")
public class BankingController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public BankingController(UserRepository userRepository, AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    @GetMapping("/account")
    public ResponseEntity<?> getAccountDetails() {
        User user = getAuthenticatedUser();
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found for user."));

        return ResponseEntity.ok(new AccountResponse(
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                user.getFullName()
        ));
    }

    @PostMapping("/transfer")
    @Transactional
    public ResponseEntity<?> transferMoney(@RequestBody TransactionRequest request) {
        User user = getAuthenticatedUser();
        Account sourceAccount = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Source account not found."));

        Account targetAccount = accountRepository.findByAccountNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new RuntimeException("Target account number not found."));

        if (sourceAccount.getAccountNumber().equals(targetAccount.getAccountNumber())) {
            return ResponseEntity.badRequest().body("Cannot transfer money to your own account number.");
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            return ResponseEntity.badRequest().body("Insufficient funds for this transaction.");
        }

        // Deduct from source and credit to target
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        targetAccount.setBalance(targetAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        // Record Transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setSourceAccount(sourceAccount);
        transaction.setTargetAccount(targetAccount);
        transaction.setAmount(request.getAmount());
        transaction.setType("TRANSFER");
        transaction.setStatus("SUCCESS");
        transaction.setDescription(request.getDescription());
        transactionRepository.save(transaction);

        return ResponseEntity.ok("Transfer successful! Transaction ID: " + transaction.getTransactionId());
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactionHistory() {
        User user = getAuthenticatedUser();
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Account not found."));

        List<Transaction> transactions = transactionRepository.findByAccountId(account.getId());
        return ResponseEntity.ok(transactions);
    }
}