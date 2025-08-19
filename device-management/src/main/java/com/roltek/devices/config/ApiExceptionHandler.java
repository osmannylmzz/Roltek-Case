// src/main/java/com/roltek/devices/config/ApiExceptionHandler.java
package com.roltek.devices.config;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.validation.FieldError;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String,Object>> handleRSE(ResponseStatusException ex) {
        Map<String,Object> body = new HashMap<>();
        body.put("error", ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString());
        body.put("status", ex.getStatusCode().value());
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,Object> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> fields = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, DefaultMessageSourceResolvable::getDefaultMessage, (a,b)->a));
        return Map.of("error","Validation failed","fields",fields);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> handleConflict(DataIntegrityViolationException ex) {
        return Map.of("error","Serial number must be unique");
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String,String> handleDenied(AccessDeniedException ex) { return Map.of("error","Forbidden"); }
}
