package isiperez.flashing.security;

import isiperez.flashing.dto.AuthTokensDTO;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationCookies {
    public static final String ACCESS_COOKIE = "AuthToken";
    public static final String REFRESH_COOKIE = "RefreshToken";
    private final JwtTokenService tokenService;

    public AuthenticationCookies(JwtTokenService tokenService) {
        this.tokenService = tokenService;
    }

    public void write(AuthTokensDTO tokens, HttpServletResponse response) {
        add(ACCESS_COOKIE, tokens.accessToken(), "/api", tokenService.getAccessTokenSeconds(), response);
        add(REFRESH_COOKIE, tokens.refreshToken(), "/api/v1/auth", tokenService.getRefreshTokenSeconds(),
            response);
    }

    public void clear(HttpServletResponse response) {
        add(ACCESS_COOKIE, "", "/api", 0, response);
        add(REFRESH_COOKIE, "", "/api/v1/auth", 0, response);
    }

    private void add(String name, String value, String path, long seconds,
            HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path(path)
            .maxAge(Duration.ofSeconds(seconds))
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
