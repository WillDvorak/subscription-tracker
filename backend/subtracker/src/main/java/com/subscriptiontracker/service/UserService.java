package com.subscriptiontracker.service;

import com.subscriptiontracker.dto.UserDTO;
import com.subscriptiontracker.entity.User;
import com.subscriptiontracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO.Response getUserById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public UserDTO.Response updateUser(Long id, UserDTO.Request req) {
        User user = findOrThrow(id);
        if (!user.getEmail().equals(req.getEmail())
                && userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Email is already taken by another account.");
        }
        user.setEmail(req.getEmail());
        return toResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.delete(findOrThrow(id));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with id: " + id));
    }

    private UserDTO.Response toResponse(User user) {
        UserDTO.Response res = new UserDTO.Response();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }
}
