package com.subscriptiontracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Monthly, Yearly, Weekly, etc. */
    @Column(name = "renew_cycle")
    private String renewCycle;

    @Column(name = "renew_date")
    private LocalDate renewDate;

    /** High, Medium, Low */
    private String priority;

    @Column(nullable = false)
    private boolean active = true;

    private String category;

    /** CSS color for the UI card */
    private String color;

    @Column(name = "text_color")
    private String textColor;

    @Column(name = "img_url", length = 1024)
    private String imgUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
