package com.roltek.devices.dto;

import com.roltek.devices.model.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeviceCreateRequest(
        @NotBlank String name,
        @NotNull DeviceType type,
        @NotBlank String serialNumber
) {
}
