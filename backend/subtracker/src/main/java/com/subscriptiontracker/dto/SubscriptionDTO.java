package com.subscriptiontracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SubscriptionDTO {

    /** Request body for creating / updating a subscription */
    @Data
    public static class Request {
        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.00", message = "Price must be non-negative")
        private BigDecimal price;

        private String renewCycle;
        private LocalDate renewDate;
        private String priority;
        private Boolean active;
        private String category;
        private String color;
        private String textColor;
        private String imgUrl;

        /** ID of the user this subscription belongs to */
        private Long userId;
    }

    /** Response body returned to the client */
    @Data
    public static class Response {
        private Long id;
        private String title;
        private BigDecimal price;
        private String renewCycle;
        private LocalDate renewDate;
        private LocalDate nextRenewalDate;
        private String priority;
        private boolean active;
        private String category;
        private String color;
        private String textColor;
        private String imgUrl;
        private LocalDateTime createdAt;
        private Long userId;
    }
}
