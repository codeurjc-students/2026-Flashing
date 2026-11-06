package isiperez.flashing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshTokenDTO(@NotBlank @Size(max = 4096) String refreshToken) {
}
