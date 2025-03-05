package com.joaogabgr.backend.core.domain.models;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Activities {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String description;
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private ActivitiesStatus status;

    @ManyToOne
    private User user;
}
