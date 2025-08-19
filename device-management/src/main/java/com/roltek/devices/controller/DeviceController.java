package com.roltek.devices.controller;

import com.roltek.devices.dto.DeviceCreateRequest;
import com.roltek.devices.dto.DeviceDto;
import com.roltek.devices.dto.DeviceUpdateRequest;
import com.roltek.devices.model.DeviceType;
import com.roltek.devices.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.UUID;
import org.springframework.data.domain.Pageable;

@RestController
@RequiredArgsConstructor
@RequestMapping("/devices")
public class DeviceController {

    private final DeviceService service;

    @GetMapping
    public Page list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) DeviceType type,
            @ParameterObject Pageable pageable
    ) {
        return (Page) service.findAll(q, type, (Pageable) pageable);
    }

    @GetMapping("/{id}")
    public DeviceDto get(@PathVariable UUID id) { return service.getById(id); }

    @PostMapping
    public DeviceDto create(@Valid @RequestBody DeviceCreateRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    public DeviceDto update(@PathVariable UUID id, @Valid @RequestBody DeviceUpdateRequest req) { return service.update(id, req); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
