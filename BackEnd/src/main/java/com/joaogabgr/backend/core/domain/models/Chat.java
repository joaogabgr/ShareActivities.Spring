package com.joaogabgr.backend.core.domain.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String content;
    private LocalDateTime createdAt;

    @ManyToOne
    private Families roomId;

    @ManyToOne
    private User sender;

}
