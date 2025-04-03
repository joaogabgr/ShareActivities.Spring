package com.joaogabgr.backend.core.domain.models;

import com.joaogabgr.backend.core.domain.enums.ActivitiesStatus;
import com.joaogabgr.backend.core.domain.enums.PriorityActivities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

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
    private String type;
    private String notes;
    private LocalDateTime dateCreated;
    private LocalDateTime dateExpire;
    private LocalDateTime dayForRecover;

    private Double latitude;
    private Double longitude;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] document;

    @Enumerated(EnumType.STRING)
    private ActivitiesStatus status;

    @Enumerated(EnumType.STRING)
    private PriorityActivities priority;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Families family;
}