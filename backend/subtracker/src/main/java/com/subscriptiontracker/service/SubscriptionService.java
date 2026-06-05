package com.subscriptiontracker.service;

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

    private SubscriptionDTO.Response toResponse(Subscription sub) {
        SubscriptionDTO.Response res = new SubscriptionDTO.Response();
        res.setId(sub.getId());
        res.setTitle(sub.getTitle());
        res.setPrice(sub.getPrice());
        res.setRenewCycle(sub.getRenewCycle());
        res.setRenewDate(sub.getRenewDate());
        res.setPriority(sub.getPriority());
        res.setCategory(sub.getCategory());
        res.setColor(sub.getColor());
        res.setTextColor(sub.getTextColor());
        res.setImgUrl(sub.getImgUrl());
        res.setCreatedAt(sub.getCreatedAt());
        res.setUserId(sub.getUser() != null ? sub.getUser().getId() : null);
        return res;
    }
}
