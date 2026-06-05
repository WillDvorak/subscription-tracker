package com.subscriptiontracker.repository;

import com.subscriptiontracker.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByUserIdAndCategory(Long userId, String category);
}
