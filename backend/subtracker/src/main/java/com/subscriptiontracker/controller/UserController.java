package com.subscriptiontracker.controller;

import com.subscriptiontracker.dto.UserDTO;
import com.subscriptiontracker.security.UserDetailsImpl;
import com.subscriptiontracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/me */
    @GetMapping("/me")
    public UserDTO.Response getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userService.getUserById(userDetails.getId());
    }

    /** PUT /api/users/me */
    @PutMapping("/me")
    public UserDTO.Response updateCurrentUser(@Valid @RequestBody UserDTO.Request req,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userService.updateUser(userDetails.getId(), req);
    }

    /** DELETE /api/users/me */
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.deleteUser(userDetails.getId());
    }
}