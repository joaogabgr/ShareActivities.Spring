package com.joaogabgr.backend.web.dto;

import java.io.IOException;

public interface DTO {
    public Object toEntity();

    public boolean isValid();

    public default boolean isNotNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}
