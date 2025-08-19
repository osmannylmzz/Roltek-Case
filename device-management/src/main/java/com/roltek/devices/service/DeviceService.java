package com.roltek.devices.service;

import com.roltek.devices.dto.DeviceCreateRequest;
import com.roltek.devices.dto.DeviceDto;
import com.roltek.devices.dto.DeviceUpdateRequest;
import com.roltek.devices.model.Device;
import com.roltek.devices.model.DeviceType;
import com.roltek.devices.model.User;
import com.roltek.devices.repository.DeviceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;



import java.util.Locale;
import java.util.Optional;

import java.util.UUID;

import static com.roltek.devices.repository.DeviceSpecifications.*;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;


    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Object principal = auth.getPrincipal();
        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid principal type");
        }
        return (User) principal;
    }


    private DeviceType parseType(Object value) {
        if (value instanceof DeviceType) {
            return (DeviceType) value;
        }
        if (value instanceof String) {
            String s = (String) value;
            try {
                return DeviceType.valueOf(s.toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid type. Allowed: SENSOR, CAMERA, LIGHT, OTHER"
                );
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid type payload");
    }

    private DeviceDto toDto(Device device) {
        return new DeviceDto(
                device.getId(),
                device.getName(),
                device.getType(),
                device.getSerialNumber(),
                device.getCreatedAt()
        );
    }


    @Transactional
    public DeviceDto create(DeviceCreateRequest request) {
        if (deviceRepository.existsBySerialNumber(request.serialNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Serial number must be unique");
        }

        User owner = currentUser();

        Device device = new Device();
        device.setSerialNumber(request.serialNumber());
        device.setName(request.name());
        device.setType(parseType(request.type())); // DTO String ya da Enum ise kabul
        device.setOwner(owner);

        try {
            Device saved = deviceRepository.save(device);
            return toDto(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Serial number must be unique");
        }
    }




    public Page<DeviceDto> findAll(String q, DeviceType type, Pageable pageable) {
        User owner = currentUser();
        Specification<Device> spec = ownerIs(owner)
                .and(nameOrSerialLike(q))
                .and(typeIs(type));

        Page<Device> page = deviceRepository.findAll(spec, (org.springframework.data.domain.Pageable) pageable);
        return page.map(this::toDto);
    }


    public DeviceDto getById(UUID id) {
        User owner = currentUser();
        Optional<Device> opt = deviceRepository.findById(id);
        Device device = opt.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found")
        );
        if (!device.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your device");
        }
        return toDto(device);
    }

    @Transactional
    public DeviceDto update(UUID id, DeviceUpdateRequest request) {
        User owner = currentUser();

        Optional<Device> opt = deviceRepository.findById(id);
        Device device = opt.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found")
        );
        if (!device.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your device");
        }

        deviceRepository.findBySerialNumber(request.serialNumber())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Serial number must be unique"); });

        device.setName(request.name());
        device.setType(parseType(request.type()));
        device.setSerialNumber(request.serialNumber());

        return toDto(device);
    }

    @Transactional
    public void delete(UUID id) {
        User owner = currentUser();

        Optional<Device> opt = deviceRepository.findById(id);
        Device device = opt.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found")
        );
        if (!device.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your device");
        }

        deviceRepository.delete(device);
    }
}
