package com.roltek.devices.dto;

import com.roltek.devices.model.DeviceType;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeviceDto(
        UUID id,
        String name,
        DeviceType type,
        String serialNumber,
        LocalDateTime createdAt
) {}