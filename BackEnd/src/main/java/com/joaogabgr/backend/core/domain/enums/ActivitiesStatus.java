package com.joaogabgr.backend.core.domain.enums;

import lombok.Getter;

@Getter
public enum ActivitiesStatus {
    PENDING("pendente"),
    IN_PROGRESS("em andamento"),
    DONE("concluído");

    private final String label;

    ActivitiesStatus(String label) {
        this.label = label;
    }
}
