package isiperez.flashing.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
    private final SecretKey secretKey;
    private final Duration accessDuration;
    private final Duration refreshDuration;

    public JwtTokenService(@Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-minutes}") long accessMinutes,
            @Value("${app.jwt.refresh-token-days}") long refreshDays) {
        this.secretKey = secret.isBlank()
            ? Jwts.SIG.HS256.key().build()
            : Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessDuration = Duration.ofMinutes(accessMinutes);
        this.refreshDuration = Duration.ofDays(refreshDays);
    }

    public String generateAccessToken(UserDetails user) {
        return generate(user, TokenType.ACCESS, accessDuration);
    }

    public String generateRefreshToken(UserDetails user) {
        return generate(user, TokenType.REFRESH, refreshDuration);
    }

    public String getSubject(String token, TokenType expectedType) {
        Claims claims = Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token).getPayload();
        if (!expectedType.name().equals(claims.get("type", String.class))) {
            throw new IllegalArgumentException("Unexpected token type");
        }
        return claims.getSubject();
    }

    public long getAccessTokenSeconds() {
        return accessDuration.toSeconds();
    }

    public long getRefreshTokenSeconds() {
        return refreshDuration.toSeconds();
    }

    private String generate(UserDetails user, TokenType type, Duration duration) {
        Instant now = Instant.now();
        return Jwts.builder()
            .id(UUID.randomUUID().toString())
            .subject(user.getUsername())
            .claim("type", type.name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(duration)))
            .signWith(secretKey)
            .compact();
    }
}
