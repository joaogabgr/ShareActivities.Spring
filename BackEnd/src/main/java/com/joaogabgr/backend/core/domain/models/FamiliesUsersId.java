package com.joaogabgr.backend.core.domain.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamiliesUsersId implements Serializable {
    private String userId;
    private String familyId;
}

