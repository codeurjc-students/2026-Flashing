package isiperez.flashing.security;

import static org.assertj.core.api.Assertions.assertThat;

import isiperez.flashing.dto.AuthTokensDTO;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;

class AuthenticationCookiesTest {
    private final JwtTokenService tokenService = new JwtTokenService("", 15, 7);

    @Test
    void secureCookiesShouldBeHttpOnlyAndHaveRestrictedPaths() {
        var cookies = new AuthenticationCookies(tokenService, true);
        var response = new MockHttpServletResponse();
        cookies.write(new AuthTokensDTO("access", "refresh"), response);

        assertThat(response.getHeaders("Set-Cookie")).hasSize(2)
            .allSatisfy(cookie -> assertThat(cookie).contains("Secure", "HttpOnly", "SameSite=Strict")
                .doesNotContain("Domain="))
            .anySatisfy(cookie -> assertThat(cookie).contains("RefreshToken=refresh", "Path=/api/v1/auth"));
    }

    @Test
    void clearingCookiesShouldRetainTheSecureFlag() {
        var cookies = new AuthenticationCookies(tokenService, true);
        var response = new MockHttpServletResponse();
        cookies.clear(response);
        assertThat(response.getHeaders("Set-Cookie")).hasSize(2)
            .allSatisfy(cookie -> assertThat(cookie).contains("Max-Age=0", "Secure", "HttpOnly"));
    }

    @Test
    void csrfCookieShouldBeSecureIncludingBehindAnHttpProxy() {
        var repository = new SecurityConfig().csrfTokenRepository(true);
        var request = new org.springframework.mock.web.MockHttpServletRequest();
        var response = new MockHttpServletResponse();
        repository.saveToken(repository.generateToken(request), request, response);
        assertThat(response.getHeaders("Set-Cookie"))
            .hasSize(1)
            .allSatisfy(cookie -> assertThat(cookie).contains("FlashingCsrf=", "Secure", "HttpOnly"));
        assertThat(response.getCookie("FlashingCsrf").getAttribute("SameSite")).isEqualTo("Strict");
    }

    @Test
    void testCookiesShouldSupportHttpWithoutRemovingOtherProtections() {
        var cookies = new AuthenticationCookies(tokenService, false);
        var response = new MockHttpServletResponse();
        cookies.write(new AuthTokensDTO("access", "refresh"), response);
        cookies.clear(response);
        assertThat(response.getHeaders("Set-Cookie")).hasSize(4)
            .allSatisfy(cookie -> assertThat(cookie).doesNotContain("Secure")
                .contains("HttpOnly", "SameSite=Strict"));
    }

    @Test
    void testCsrfCookieShouldSupportHttpWithoutRemovingOtherProtections() {
        var repository = new SecurityConfig().csrfTokenRepository(false);
        var request = new org.springframework.mock.web.MockHttpServletRequest();
        var response = new MockHttpServletResponse();
        repository.saveToken(repository.generateToken(request), request, response);
        assertThat(response.getHeaders("Set-Cookie")).hasSize(1)
            .allSatisfy(cookie -> assertThat(cookie).doesNotContain("Secure")
                .contains("HttpOnly"));
        assertThat(response.getCookie("FlashingCsrf").getAttribute("SameSite")).isEqualTo("Strict");
    }
}
