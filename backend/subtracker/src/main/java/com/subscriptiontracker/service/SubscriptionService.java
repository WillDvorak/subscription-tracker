package com.subscriptiontracker.service;

import java.time.LocalDate;

import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.entity.Subscription;
import com.subscriptiontracker.entity.User;
import com.subscriptiontracker.repository.SubscriptionRepository;
import com.subscriptiontracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public List<SubscriptionDTO.Response> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SubscriptionDTO.Response> getSubscriptionsByUser(Long userId) {
        assertUserExists(userId);
        return subscriptionRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SubscriptionDTO.Response getSubscriptionById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public SubscriptionDTO.Response createSubscription(SubscriptionDTO.Request req) {
        Subscription sub = new Subscription();
        applyRequest(req, sub);
        return toResponse(subscriptionRepository.save(sub));
    }

    public SubscriptionDTO.Response updateSubscription(Long id, SubscriptionDTO.Request req) {
        Subscription sub = findOrThrow(id);
        applyRequest(req, sub);
        return toResponse(subscriptionRepository.save(sub));
    }

    public void deleteSubscription(Long id) {
        subscriptionRepository.delete(findOrThrow(id));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void applyRequest(SubscriptionDTO.Request req, Subscription sub) {
        sub.setTitle(req.getTitle());
        sub.setPrice(req.getPrice());
        sub.setRenewCycle(req.getRenewCycle());
        sub.setRenewDate(req.getRenewDate());
        sub.setPriority(req.getPriority());
        sub.setActive(req.getActive() != null ? req.getActive() : true);
        sub.setCategory(req.getCategory());
        sub.setColor(req.getColor());
        sub.setTextColor(req.getTextColor());
        sub.setImgUrl(req.getImgUrl());

        if (req.getUserId() != null) {
            User user = userRepository.findById(req.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "User not found with id: " + req.getUserId()));
            sub.setUser(user);
        } else {
            sub.setUser(null);
        }
    }

    private Subscription findOrThrow(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subscription not found with id: " + id));
    }

    private void assertUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User not found with id: " + userId);
        }
    }

    private LocalDate calculateNextRenewal(LocalDate renewDate, String renewCycle) {
        if (renewDate == null || renewCycle == null){
            return null;
        }

        LocalDate next = renewDate;
        LocalDate today = LocalDate.now();

        while (!next.isAfter(today)){
            switch(renewCycle) {
                case "Weekly" -> next = next.plusWeeks(1);
                case "Monthly" -> next = next.plusMonths(1);
                case "Quarterly" -> next = next.plusMonths(3);
                case "Biannually" -> next = next.plusMonths(6);
                case "Yearly" -> next = next.plusYears(1);
                default -> {return null;}
            }
        }

        return next;
    }

    private LocalDate calculateLastRenewal(LocalDate nextRenewDate, String renewCycle) {
        if (nextRenewDate == null || renewCycle == null){
            return null;
        }

        LocalDate last = nextRenewDate;

        switch(renewCycle) {
                case "Weekly" -> last = last.minusWeeks(1);
                case "Monthly" -> last = last.minusMonths(1);
                case "Quarterly" -> last = last.minusMonths(3);
                case "Biannually" -> last = last.minusMonths(6);
                case "Yearly" -> last = last.minusYears(1);
                default -> {return null;}
            }
        
        return last;
    }

    private SubscriptionDTO.Response toResponse(Subscription sub) {
        SubscriptionDTO.Response res = new SubscriptionDTO.Response();
        res.setId(sub.getId());
        res.setTitle(sub.getTitle());
        res.setPrice(sub.getPrice());
        res.setRenewCycle(sub.getRenewCycle());
        res.setRenewDate(sub.getRenewDate());
        LocalDate nextRenewal = calculateNextRenewal(sub.getRenewDate(), sub.getRenewCycle());
        res.setNextRenewalDate(nextRenewal);
        res.setLastRenewalDate(calculateLastRenewal(nextRenewal, sub.getRenewCycle()));
        res.setPriority(sub.getPriority());
        res.setActive(sub.isActive());
        res.setCategory(sub.getCategory());
        res.setColor(sub.getColor());
        res.setTextColor(sub.getTextColor());
        res.setImgUrl(sub.getImgUrl());
        res.setCreatedAt(sub.getCreatedAt());
        res.setUserId(sub.getUser() != null ? sub.getUser().getId() : null);
        return res;
    }
}
