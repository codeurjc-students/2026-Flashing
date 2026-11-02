package isiperez.flashing.service;

import isiperez.flashing.dto.AuthTokensDTO;
import isiperez.flashing.dto.LoginRequestDTO;
import org.springframework.security.authentication.BadCredentialsException;
import isiperez.flashing.security.JwtTokenService;
import isiperez.flashing.security.TokenType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenService tokenService;
    private final UserService userService;

    public AuthenticationService(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
            JwtTokenService tokenService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.tokenService = tokenService;
        this.userService = userService;
    }

    public AuthTokensDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        userService.recordLogin(request.email());
        return createTokens(userDetailsService.loadUserByUsername(request.email()));
    }

    public AuthTokensDTO refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BadCredentialsException("Refresh cookie is required");
        }
        String email;
        try {
            email = tokenService.getSubject(refreshToken, TokenType.REFRESH);
        } catch (IllegalArgumentException exception) {
            throw new BadCredentialsException("Invalid refresh token", exception);
        }
        UserDetails user = userDetailsService.loadUserByUsername(email);
        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled");
        }
        return createTokens(user);
    }

    private AuthTokensDTO createTokens(UserDetails user) {
        return new AuthTokensDTO(tokenService.generateAccessToken(user), tokenService.generateRefreshToken(user));
    }
}
