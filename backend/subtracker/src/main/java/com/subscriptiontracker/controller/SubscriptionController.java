package com.subscriptiontracker.controller;

import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.security.UserDetailsImpl;
import com.subscriptiontracker.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** GET /api/subscriptions */
    @GetMapping
    public List<SubscriptionDTO.Response> getMySubscriptions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return subscriptionService.getSubscriptionsByUser(userDetails.getId());
    }

    /** GET /api/subscriptions/{id} */
    @GetMapping("/{id}")
    public SubscriptionDTO.Response getSubscriptionById(@PathVariable Long id, 
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return subscriptionService.getSubscriptionById(id, userDetails.getId());
    }

    /** POST /api/subscriptions */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionDTO.Response createSubscription(
            @Valid @RequestBody SubscriptionDTO.Request req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return subscriptionService.createSubscription(req, userDetails.getId());
    }

    /** PUT /api/subscriptions/{id} */
    @PutMapping("/{id}")
    public SubscriptionDTO.Response updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionDTO.Request req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return subscriptionService.updateSubscription(id, req, userDetails.getId());
    }

    /** DELETE /api/subscriptions/{id} */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubscription(@PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        subscriptionService.deleteSubscription(id, userDetails.getId());
    }
}
