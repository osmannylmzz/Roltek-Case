package com.roltek.devices.repository;

import com.roltek.devices.model.Device;
import com.roltek.devices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DeviceRepository
        extends JpaRepository<Device, UUID>, JpaSpecificationExecutor<Device> {

    Optional<Device> findBySerialNumber(String serialNumber);
    boolean existsBySerialNumber(String serialNumber);
    List<Device> findAllByOwner(User owner);
}
