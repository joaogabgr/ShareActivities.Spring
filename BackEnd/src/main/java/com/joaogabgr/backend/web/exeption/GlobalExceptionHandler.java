package com.joaogabgr.backend.web.exeption;

import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SystemContextException.class)
    public ResponseEntity<?> handleSystemContextException(SystemContextException ex, WebRequest request) {
        var response = new ResponseModelDTO(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}