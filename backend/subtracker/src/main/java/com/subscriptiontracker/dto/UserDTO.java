package com.subscriptiontracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

public class UserDTO {

    /** Request body for creating / updating a user */
    @Data
    public static class Request {
        @NotBlank(message = "Username is required")
        private String username;

        @Email(message = "Must be a valid email")
        @NotBlank(message = "Email is required")
        private String email;
    }

    /** Response body returned to the client */
    @Data
    public static class Response {
        private Long id;
        private String username;
        private String email;
        private LocalDateTime createdAt;
    }
}
