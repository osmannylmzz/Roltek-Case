package com.roltek.devices.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
@Getter
@Setter
@Entity
@Table(name ="users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Email
    @NotBlank
    @Column(unique = true,name = "email")
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String passwordHash;

    private LocalDateTime createdAt = LocalDateTime.now();

}
