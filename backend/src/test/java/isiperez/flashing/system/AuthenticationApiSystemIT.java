package isiperez.flashing.system;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import io.restassured.filter.cookie.CookieFilter;
import io.restassured.specification.RequestSpecification;
import isiperez.flashing.TestcontainersConfiguration;
import isiperez.flashing.model.User;
import isiperez.flashing.model.UserRole;
import isiperez.flashing.repository.UserRepository;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class AuthenticationApiSystemIT {
    @LocalServerPort int port;
    @Autowired UserRepository repository;
    @Autowired PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void registeredUserShouldLoginWithHttpOnlyCookiesAndAccessOwnProfile() {
        CookieFilter browser = new CookieFilter();
        withCsrf(browser).body(Map.of("username", "isi", "displayName", "Isi Pérez",
                "email", "isi@example.com", "password", "Password_1", "timezone", "Europe/Madrid"))
            .post("/api/v1/users").then().statusCode(201).body("role", equalTo("USER"));

        var response = login(browser, "isi@example.com");
        assertThat(response.asString()).isEmpty();
        assertThat(response.getHeaders().getValues("Set-Cookie"))
            .anySatisfy(cookie -> assertThat(cookie).contains("AuthToken=", "HttpOnly", "SameSite=Strict", "Path=/api"))
            .anySatisfy(cookie -> assertThat(cookie).contains("RefreshToken=", "HttpOnly", "SameSite=Strict",
                "Path=/api/v1/auth"));

        given().port(port).filter(browser).get("/api/v1/users/me")
            .then().statusCode(200).body("username", equalTo("isi"));
    }

    @Test
    void profileShouldRejectAnonymousRequests() {
        given().port(port).get("/api/v1/users/me").then().statusCode(401);
    }

    @Test
    void loginShouldRejectMissingAndIncorrectCsrfTokens() {
        given().port(port).contentType("application/json")
            .body(Map.of("email", "isi@example.com", "password", "Password_1"))
            .post("/api/v1/auth/login").then().statusCode(403);
        CookieFilter browser = new CookieFilter();
        withCsrf(browser);
        given().port(port).filter(browser).contentType("application/json")
            .header("X-CSRF-TOKEN", "incorrect-token")
            .body(Map.of("email", "isi@example.com", "password", "Password_1"))
            .post("/api/v1/auth/login").then().statusCode(403);
    }

    @Test
    void refreshShouldUseOnlyRefreshCookieAndLogoutShouldRemoveCookies() {
        saveUser("regular", UserRole.USER);
        CookieFilter browser = new CookieFilter();
        var response = login(browser, "regular@example.com");
        String accessToken = response.cookie("AuthToken");

        given().port(port).header("Authorization", "Bearer " + accessToken)
            .get("/api/v1/users/me").then().statusCode(401);

        withCsrf(new CookieFilter())
            .body(Map.of("refreshToken", response.cookie("RefreshToken")))
            .post("/api/v1/auth/refresh").then().statusCode(401);

        withCsrf(browser).post("/api/v1/auth/refresh").then().statusCode(204);
        given().port(port).filter(browser).get("/api/v1/users/me").then().statusCode(200);

        withCsrf(browser).post("/api/v1/auth/logout").then().statusCode(204);
        given().port(port).filter(browser).get("/api/v1/users/me").then().statusCode(401);
        withCsrf(browser).post("/api/v1/auth/refresh").then().statusCode(401);
    }

    @Test
    void profileChangesShouldRequireCsrfAndDeletionShouldDisableTheAccount() {
        saveUser("regular", UserRole.USER);
        CookieFilter browser = new CookieFilter();
        login(browser, "regular@example.com");
        Map<String, String> changes = Map.of("username", "updated", "displayName", "Updated name",
            "timezone", "Europe/Madrid");
        given().port(port).filter(browser).contentType("application/json").body(changes)
            .put("/api/v1/users/me").then().statusCode(403);
        withCsrf(browser).body(changes).put("/api/v1/users/me")
            .then().statusCode(200).body("username", equalTo("updated"));
        withCsrf(browser).delete("/api/v1/users/me").then().statusCode(204);
        given().port(port).filter(browser).get("/api/v1/users/me").then().statusCode(401);
    }

    @Test
    void userListShouldBeAvailableOnlyToAdministrators() {
        saveUser("regular", UserRole.USER);
        saveUser("admin", UserRole.ADMIN);
        CookieFilter userBrowser = new CookieFilter();
        CookieFilter adminBrowser = new CookieFilter();
        login(userBrowser, "regular@example.com");
        login(adminBrowser, "admin@example.com");
        given().port(port).filter(userBrowser).get("/api/v1/users").then().statusCode(403);
        given().port(port).filter(adminBrowser).get("/api/v1/users")
            .then().statusCode(200).body("content.size()", equalTo(2));
    }

    private RequestSpecification withCsrf(CookieFilter browser) {
        String csrfToken = given().port(port).filter(browser).get("/api/v1/auth/csrf")
            .then().statusCode(200).extract().path("token");
        return given().port(port).filter(browser).contentType("application/json")
            .header("X-CSRF-TOKEN", csrfToken);
    }

    private io.restassured.response.Response login(CookieFilter browser, String email) {
        return withCsrf(browser).body(Map.of("email", email, "password", "Password_1"))
            .post("/api/v1/auth/login").then().statusCode(204).extract().response();
    }

    private void saveUser(String username, UserRole role) {
        repository.saveAndFlush(new User(username, username, username + "@example.com",
            passwordEncoder.encode("Password_1"), role, "Europe/Madrid"));
    }
}
