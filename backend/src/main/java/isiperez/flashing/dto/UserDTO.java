package isiperez.flashing.dto;

import isiperez.flashing.model.UserRole;
import isiperez.flashing.model.UserStatus;
import java.time.Instant;

public record UserDTO(Long id, String username, String displayName, String email, UserRole role,
        String timezone, Instant createdAt, Instant lastLoginAt, UserStatus status) {
}
