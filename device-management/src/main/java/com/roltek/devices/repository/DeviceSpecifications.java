
package com.roltek.devices.repository;

import com.roltek.devices.model.*;
import org.springframework.data.jpa.domain.Specification;

public class DeviceSpecifications {
    public static Specification<Device> ownerIs(User owner) {
        return (root,q,cb) -> cb.equal(root.get("owner"), owner);
    }
    public static Specification<Device> nameOrSerialLike(String qstr) {
        if (qstr == null || qstr.isBlank()) return (root,q,cb) -> cb.conjunction();
        String like = "%" + qstr.toLowerCase() + "%";
        return (root,q,cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("serialNumber")), like)
        );
    }
    public static Specification<Device> typeIs(DeviceType type) {
        if (type == null) return (root,q,cb) -> cb.conjunction();
        return (root,q,cb) -> cb.equal(root.get("type"), type);
    }
}
