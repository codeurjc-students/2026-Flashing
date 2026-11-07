package isiperez.flashing.controller;

import isiperez.flashing.dto.ApiErrorDTO;
import isiperez.flashing.exception.ConflictException;
import isiperez.flashing.exception.ResourceNotFoundException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorDTO> handleAuthentication(AuthenticationException exception,
            HttpServletRequest request) {
        String message = request.getServletPath().endsWith("/refresh")
            ? "Session is invalid or expired"
            : "Invalid email or password";
        return error(HttpStatus.UNAUTHORIZED, message, request, Map.of());
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorDTO> handleInvalidToken(JwtException exception,
            HttpServletRequest request) {
        return error(HttpStatus.UNAUTHORIZED, "Token is invalid or expired", request, Map.of());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorDTO> handleConflict(ConflictException exception, HttpServletRequest request) {
        return error(HttpStatus.CONFLICT, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorDTO> handleNotFound(ResourceNotFoundException exception, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDTO> handleValidation(MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
            .forEach(field -> fields.putIfAbsent(field.getField(), field.getDefaultMessage()));
        return error(HttpStatus.BAD_REQUEST, "Request validation failed", request, fields);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDTO> handleBadRequest(IllegalArgumentException exception,
            HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage(), request, Map.of());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorDTO> handleUnreadableBody(HttpMessageNotReadableException exception,
            HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, "Request body is not valid", request, Map.of());
    }

    private ResponseEntity<ApiErrorDTO> error(HttpStatus status, String message, HttpServletRequest request,
            Map<String, String> fields) {
        ApiErrorDTO body = new ApiErrorDTO(Instant.now(), status.value(), status.getReasonPhrase(), message,
            request.getRequestURI(), fields);
        return ResponseEntity.status(status).body(body);
    }
}
