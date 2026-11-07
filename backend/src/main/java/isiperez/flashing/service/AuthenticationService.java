package isiperez.flashing.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import isiperez.flashing.dto.AuthTokensDTO;
import isiperez.flashing.dto.LoginRequestDTO;
import isiperez.flashing.model.AuthSession;
import isiperez.flashing.repository.AuthSessionRepository;
import org.springframework.security.authentication.BadCredentialsException;
import isiperez.flashing.security.JwtTokenService;
import isiperez.flashing.security.TokenType;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenService tokenService;
    private final UserService userService;
    private final AuthSessionRepository sessions;

    public AuthenticationService(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
            JwtTokenService tokenService, UserService userService, AuthSessionRepository sessions) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.tokenService = tokenService;
        this.userService = userService;
        this.sessions = sessions;
    }

    @Transactional
    public AuthTokensDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        userService.recordLogin(request.email());
        UserDetails user = userDetailsService.loadUserByUsername(request.email());
        String sessionId = UUID.randomUUID().toString();
        String refreshId = UUID.randomUUID().toString();
        sessions.save(new AuthSession(sessionId, refreshId, refreshExpiration()));
        return createTokens(user, sessionId, refreshId);
    }

    // El rechazo de una renovación reutilizada debe confirmar el borrado de la sesión.
    @Transactional(noRollbackFor = BadCredentialsException.class)
    public AuthTokensDTO refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BadCredentialsException("Refresh token is required");
        }
        Claims claims;
        try {
            claims = tokenService.getClaims(refreshToken, TokenType.REFRESH);
        } catch (IllegalArgumentException exception) {
            throw new BadCredentialsException("Invalid refresh token", exception);
        }
        String sessionId = claims.get("sid", String.class);
        AuthSession session = sessions.findForUpdate(sessionId)
            .orElseThrow(() -> new BadCredentialsException("Session is no longer active"));
        if (!session.getRefreshId().equals(claims.getId())) {
            sessions.delete(session);
            throw new BadCredentialsException("Refresh token has already been used");
        }
        UserDetails user = userDetailsService.loadUserByUsername(claims.getSubject());
        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled");
        }
        String refreshId = UUID.randomUUID().toString();
        session.rotate(refreshId, refreshExpiration());
        return createTokens(user, sessionId, refreshId);
    }

    @Transactional
    public void revoke(String token, TokenType type) {
        if (token == null || token.isBlank()) return;
        try {
            String sessionId = tokenService.getClaimsForRevocation(token, type).get("sid", String.class);
            sessions.findForUpdate(sessionId).ifPresent(sessions::delete);
        } catch (JwtException | IllegalArgumentException ignored) {
            // Cerrar sesión es idempotente y acepta credenciales antiguas o inválidas.
        }
    }

    private Instant refreshExpiration() {
        return Instant.now().plusSeconds(tokenService.getRefreshTokenSeconds());
    }

    private AuthTokensDTO createTokens(UserDetails user, String sessionId, String refreshId) {
        return new AuthTokensDTO(tokenService.generateAccessToken(user, sessionId),
            tokenService.generateRefreshToken(user, sessionId, refreshId));
    }
}
