package com.joaogabgr.backend.core.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamiliesUsers {
    @EmbeddedId
    private FamiliesUsersId id = new FamiliesUsersId();

    @JsonIgnore
    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("familyId")
    @JoinColumn(name = "family_id")
    private Families family;

    private Boolean isAdmin;
}
