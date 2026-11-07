package isiperez.flashing.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import jakarta.servlet.http.Cookie;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import isiperez.flashing.repository.AuthSessionRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenService tokenService;
    private final AuthSessionRepository sessions;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtTokenService tokenService,
            AuthSessionRepository sessions) {
        this.userDetailsService = userDetailsService;
        this.tokenService = tokenService;
        this.sessions = sessions;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        // Una cabecera explícita nunca se sustituye por una cookie.
        String token = authorization == null ? accessTokenFromCookies(request)
            : authorization.startsWith("Bearer ") ? authorization.substring(7) : null;
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Claims claims = tokenService.getClaims(token, TokenType.ACCESS);
                if (!sessions.existsByIdAndExpiresAtAfter(claims.get("sid", String.class), Instant.now())) {
                    filterChain.doFilter(request, response);
                    return;
                }
                UserDetails user = userDetailsService.loadUserByUsername(claims.getSubject());
                if (!user.isEnabled()) {
                    filterChain.doFilter(request, response);
                    return;
                }
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }

    private String accessTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (AuthenticationCookies.ACCESS_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
