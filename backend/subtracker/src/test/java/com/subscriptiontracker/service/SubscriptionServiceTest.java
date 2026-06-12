package com.subscriptiontracker.service;

import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.entity.Subscription;
import com.subscriptiontracker.repository.SubscriptionRepository;
import com.subscriptiontracker.repository.UserRepository;
import com.subscriptiontracker.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    @Test
    void nextRenewalDate_isInFuture_forPastRenewDate() {
        // Arrange 
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        SubscriptionDTO.Request req = new SubscriptionDTO.Request();
        req.setTitle("Netflix");
        req.setPrice(BigDecimal.valueOf(15.99));
        req.setRenewCycle("Monthly");
        req.setRenewDate(LocalDate.now().minusMonths(2));

        Subscription saved = new Subscription();
        saved.setTitle("Netflix");
        saved.setPrice(BigDecimal.valueOf(15.99));
        saved.setRenewCycle("Monthly");
        saved.setRenewDate(LocalDate.now().minusMonths(2));

        when(subscriptionRepository.save(any())).thenReturn(saved);

        // Act
        SubscriptionDTO.Response response = subscriptionService.createSubscription(req, 1L);

        // Assert
        assertThat(response.getNextRenewalDate()).isAfter(LocalDate.now());
    }

    @Test
    void nextRenewalDate_isNull_whenRenewCycleIsNull() {
        // Arrange
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        SubscriptionDTO.Request req = new SubscriptionDTO.Request();
        req.setTitle("Netflix");
        req.setPrice(BigDecimal.valueOf(15.99));
        req.setRenewDate(LocalDate.now().minusMonths(2));

        
        Subscription saved = new Subscription();
        saved.setTitle("Netflix");
        saved.setPrice(BigDecimal.valueOf(15.99));
        saved.setRenewDate(LocalDate.now().minusMonths(2));

        when(subscriptionRepository.save(any())).thenReturn(saved);

        // Act
        SubscriptionDTO.Response response = subscriptionService.createSubscription(req, 1L);

        // Assert
        assertThat(response.getNextRenewalDate()).isNull();
    }

    @Test
    void createSubscription_defaultsToActive() {
        // Arrange
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        SubscriptionDTO.Request req = new SubscriptionDTO.Request();
        req.setTitle("Netflix");
        req.setPrice(BigDecimal.valueOf(15.99));
        req.setRenewCycle("Monthly");
        req.setRenewDate(LocalDate.now().minusMonths(2));

        Subscription saved = new Subscription();
        saved.setTitle("Netflix");
        saved.setPrice(BigDecimal.valueOf(15.99));
        saved.setRenewCycle("Monthly");
        saved.setRenewDate(LocalDate.now().minusMonths(2));

        when(subscriptionRepository.save(any())).thenReturn(saved);

        // Act
        SubscriptionDTO.Response response = subscriptionService.createSubscription(req, 1L);

        // Assert
        assertThat(response.isActive()).isTrue();
    }

    @Test
    void createSubscription_throwsNotFound_forUnknownUser() {
        //Arrange
        SubscriptionDTO.Request req = new SubscriptionDTO.Request();
        req.setTitle("Netflix");
        req.setPrice(BigDecimal.valueOf(15.99));
        req.setRenewCycle("Monthly");
        req.setRenewDate(LocalDate.now().minusMonths(2));

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Assert
        assertThatThrownBy(() -> subscriptionService.createSubscription(req, 999L))
            .isInstanceOf(ResponseStatusException.class);
    }
}

