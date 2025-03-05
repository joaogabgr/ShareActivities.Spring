package com.joaogabgr.backend.web.dto.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ResponseModelDTO {
    private int status;
    private Object model;
    private String error;

    public ResponseModelDTO(Object model) {
        this.status = 200;
        this.model = model;
        this.error = "";
    }

    public ResponseModelDTO(String model) {
        this.status = 200;
        this.model = model;
        this.error = "";
    }

    public ResponseModelDTO(HttpStatus status, String error) {
        this.status = status.value();
        this.model = "";
        this.error = error;
    }
}
