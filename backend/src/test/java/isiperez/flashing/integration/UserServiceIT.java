package isiperez.flashing.integration;

import static org.assertj.core.api.Assertions.assertThat;

import isiperez.flashing.dto.RegisterUserDTO;
import isiperez.flashing.dto.UserDTO;
import isiperez.flashing.model.UserRole;
import isiperez.flashing.repository.UserRepository;
import isiperez.flashing.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

@Testcontainers
@SpringBootTest
class UserServiceIT {
    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:9.6")
        .withDatabaseName("flashing_test")
        .withUsername("flashing_test")
        .withPassword("flashing_test");

    @Autowired UserService service;
    @Autowired UserRepository repository;
    @Autowired PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void registerShouldPersistUserWithEncodedPasswordInMySql() {
        UserDTO created = service.register(new RegisterUserDTO("isi", "Isi Pérez", "isi@example.com",
            "Password_1", "Europe/Madrid"));

        var stored = repository.findByEmailIgnoreCase("isi@example.com").orElseThrow();
        assertThat(created.role()).isEqualTo(UserRole.USER);
        assertThat(stored.getPasswordHash()).isNotEqualTo("Password_1");
        assertThat(passwordEncoder.matches("Password_1", stored.getPasswordHash())).isTrue();
    }
}
