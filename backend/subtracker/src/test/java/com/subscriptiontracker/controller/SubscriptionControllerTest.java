package com.subscriptiontracker.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.subscriptiontracker.dto.AuthDTO;
import com.subscriptiontracker.dto.SubscriptionDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @BeforeEach
    void registerAndLogin() throws Exception {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setEmail("testuser-" + UUID.randomUUID() + "@example.com");
        req.setPassword("password123");

        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        token = json.get("token").asText();
    }

    @Test
    void createSubscription_returns201() throws Exception {
        // Arrange
        SubscriptionDTO.Request req = new SubscriptionDTO.Request();
        req.setTitle("Netflix");
        req.setPrice(BigDecimal.valueOf(15.99));
        req.setRenewCycle("Monthly");
        req.setRenewDate(LocalDate.of(2024, 1, 1));

        // Act & Assert
        mockMvc.perform(post("/api/subscriptions")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Netflix"))
            .andExpect(jsonPath("$.nextRenewalDate").isNotEmpty());
    }

    @Test
    void getSubscription_returns404_forUnknownId() throws Exception {
        mockMvc.perform(get("/api/subscriptions/9999")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNotFound());
    }

    @Test
    void getSubscriptions_returns403_withoutToken() throws Exception {
        mockMvc.perform(get("/api/subscriptions"))
            .andExpect(status().isForbidden());
    }
}
