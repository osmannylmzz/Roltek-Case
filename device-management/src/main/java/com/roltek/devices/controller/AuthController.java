// src/main/java/com/roltek/devices/controller/AuthController.java
package com.roltek.devices.controller;

import com.roltek.devices.dto.LoginRequest;
import com.roltek.devices.dto.LoginResponse;
import com.roltek.devices.model.User;
import com.roltek.devices.security.JwtService;
import com.roltek.devices.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserRepository users;
    private final JwtService jwt;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository users, JwtService jwt, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.jwt = jwt;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@RequestBody LoginRequest req) {
        User u = users.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return new LoginResponse(jwt.generateToken(u.getId(), u.getEmail()));
    }
}
