package isiperez.flashing.controller;

import isiperez.flashing.dto.LoginRequestDTO;
import isiperez.flashing.dto.CsrfTokenDTO;
import isiperez.flashing.security.AuthenticationCookies;
import isiperez.flashing.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationRestController {
    private final AuthenticationService service;
    private final AuthenticationCookies cookies;
    private final CookieCsrfTokenRepository csrfTokenRepository;

    public AuthenticationRestController(AuthenticationService service, AuthenticationCookies cookies,
            CookieCsrfTokenRepository csrfTokenRepository) {
        this.service = service;
        this.cookies = cookies;
        this.csrfTokenRepository = csrfTokenRepository;
    }

    @GetMapping("/csrf")
    public ResponseEntity<CsrfTokenDTO> csrf(CsrfToken token) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
            .body(new CsrfTokenDTO(token.getHeaderName(), token.getToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDTO credentials,
            HttpServletRequest request, HttpServletResponse response) {
        cookies.write(service.login(credentials), response);
        csrfTokenRepository.saveToken(null, request, response);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(
            @CookieValue(name = AuthenticationCookies.REFRESH_COOKIE, required = false) String refreshToken,
            HttpServletRequest request, HttpServletResponse response) {
        cookies.write(service.refresh(refreshToken), response);
        csrfTokenRepository.saveToken(null, request, response);
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        cookies.clear(response);
        csrfTokenRepository.saveToken(null, request, response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().cacheControl(CacheControl.noStore()).build();
    }
}
