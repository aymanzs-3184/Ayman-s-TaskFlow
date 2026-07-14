package com.taskflow.api.service;

import com.taskflow.api.dto.AuthResponse;
import com.taskflow.api.dto.LoginRequest;
import com.taskflow.api.dto.RegisterRequest;
import com.taskflow.api.model.User;
import com.taskflow.api.repository.UserRepository;
import com.taskflow.api.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest req) {
        
        if (userRepository.existsByEmail(req.getEmail())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword())) // hash it
                .build();
        userRepository.save(user);
        var userDetails = buildUserDetails(user);
        return new AuthResponse(jwtService.generateToken(userDetails), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow();
        var userDetails = buildUserDetails(user);
        return new AuthResponse(jwtService.generateToken(userDetails), user.getName(), user.getEmail());
    }

    private org.springframework.security.core.userdetails.UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();
    }
}