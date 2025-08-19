package com.roltek.devices.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.roltek.devices.model.User;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name="device") // singular ve lowercase daha standart
public class Device {
    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DeviceType type;

    @NotBlank
    @Column(unique = true, name = "serial_number", nullable = false)
    private String serialNumber;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

}
