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
public class  Activities {
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

    @Column(length = 1000)
    private String linkUrl;

    @Column(length = 1000)
    private String imageUrl;
    
    @Column(length = 1000)
    private String documentUrl;
    
    @Column(length = 255)
    private String documentName;
    
    @Column(length = 255)
    private String imageName;

    @Enumerated(EnumType.STRING)
    private ActivitiesStatus status;

    @Enumerated(EnumType.STRING)
    private PriorityActivities priority;

    @Column()
    private boolean warning;

    @Column(columnDefinition = "boolean default false")
    private boolean isConfirmed;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Families family;
}