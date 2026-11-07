package isiperez.flashing.controller;

import isiperez.flashing.dto.AuthTokensDTO;
import isiperez.flashing.dto.LoginRequestDTO;
import isiperez.flashing.dto.RefreshTokenDTO;
import isiperez.flashing.security.TokenType;
import isiperez.flashing.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/mobile")
public class MobileAuthenticationRestController {
    private final AuthenticationService service;

    public MobileAuthenticationRestController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokensDTO> login(@Valid @RequestBody LoginRequestDTO credentials) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.login(credentials));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthTokensDTO> refresh(@Valid @RequestBody RefreshTokenDTO request) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
            .body(service.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenDTO request) {
        service.revoke(request.refreshToken(), TokenType.REFRESH);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }
}
