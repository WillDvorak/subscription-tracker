package com.subscriptiontracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.subscriptiontracker.dto.SubscriptionDTO;
import com.subscriptiontracker.dto.UserDTO;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

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
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Netflix"))
            .andExpect(jsonPath("$.nextRenewalDate").isNotEmpty());
    }

    @Test
    void getSubscription_returns404_forUnknownId() throws Exception{
        mockMvc.perform(get("/api/subscriptions/9999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createUser_returns409_forDuplicateEmail() throws Exception{
    
        UserDTO.Request req = new UserDTO.Request();
        req.setEmail("example@email.com");
        req.setUsername("example");

        UserDTO.Request req_duplicate = new UserDTO.Request();
        req_duplicate.setEmail("example@email.com");
        req_duplicate.setUsername("duplicate");
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated());

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req_duplicate)))
            .andExpect(status().isConflict());
        
    }
}