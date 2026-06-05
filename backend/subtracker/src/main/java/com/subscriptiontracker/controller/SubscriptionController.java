package com.subscriptiontracker.controller;

import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** GET /api/subscriptions */
    @GetMapping
    public List<SubscriptionDTO.Response> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    /** GET /api/subscriptions/{id} */
    @GetMapping("/{id}")
    public SubscriptionDTO.Response getSubscriptionById(@PathVariable Long id) {
        return subscriptionService.getSubscriptionById(id);
    }

    /** POST /api/subscriptions */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionDTO.Response createSubscription(
            @Valid @RequestBody SubscriptionDTO.Request req) {
        return subscriptionService.createSubscription(req);
    }

    /** PUT /api/subscriptions/{id} */
    @PutMapping("/{id}")
    public SubscriptionDTO.Response updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionDTO.Request req) {
        return subscriptionService.updateSubscription(id, req);
    }

    /** DELETE /api/subscriptions/{id} */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
    }
}
