package com.backend.aiverifysnap.config;

/**
 * Custom exception for when a requested entity is not found.
 * Handled by {@link GlobalExceptionHandler} to return a 404 response.
 */
public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}
