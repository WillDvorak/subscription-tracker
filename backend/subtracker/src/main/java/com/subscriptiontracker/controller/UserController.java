package com.subscriptiontracker.controller;

import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.dto.UserDTO;
import com.subscriptiontracker.service.SubscriptionService;
import com.subscriptiontracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SubscriptionService subscriptionService;

    /** GET /api/users */
    @GetMapping
    public List<UserDTO.Response> getAllUsers() {
        return userService.getAllUsers();
    }

    /** GET /api/users/{id} */
    @GetMapping("/{id}")
    public UserDTO.Response getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /** POST /api/users */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO.Response createUser(@Valid @RequestBody UserDTO.Request req) {
        return userService.createUser(req);
    }

    /** PUT /api/users/{id} */
    @PutMapping("/{id}")
    public UserDTO.Response updateUser(@PathVariable Long id,
                                       @Valid @RequestBody UserDTO.Request req) {
        return userService.updateUser(id, req);
    }

    /** DELETE /api/users/{id} */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    /** GET /api/users/{id}/subscriptions */
    @GetMapping("/{id}/subscriptions")
    public List<SubscriptionDTO.Response> getUserSubscriptions(@PathVariable Long id) {
        return subscriptionService.getSubscriptionsByUser(id);
    }
}
