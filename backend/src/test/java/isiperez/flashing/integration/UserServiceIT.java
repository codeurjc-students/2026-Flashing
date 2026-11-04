package isiperez.flashing.integration;

import static org.assertj.core.api.Assertions.assertThat;

import isiperez.flashing.dto.RegisterUserDTO;
import isiperez.flashing.dto.NotificationPreferencesDTO;
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
            "Password_1", "Europe/Madrid", false));

        var stored = repository.findByEmailIgnoreCase("isi@example.com").orElseThrow();
        assertThat(created.role()).isEqualTo(UserRole.USER);
        assertThat(stored.getPasswordHash()).isNotEqualTo("Password_1");
        assertThat(passwordEncoder.matches("Password_1", stored.getPasswordHash())).isTrue();
    }

    @Test
    void launchNotificationShouldPersistAndAllowWithdrawalAndAccountDeletion() {
        service.register(new RegisterUserDTO("earlybird", "Early bird", "bird@example.com",
            "Password_1", "UTC", true));
        var stored = repository.findByEmailIgnoreCase("bird@example.com").orElseThrow();
        assertThat(stored.isLaunchUpdates()).isTrue();
        assertThat(stored.getLaunchUpdatesConsentAt()).isNotNull();

        UserDTO updated = service.updateNotificationPreferences("bird@example.com",
            new NotificationPreferencesDTO(false));
        stored = repository.findByEmailIgnoreCase("bird@example.com").orElseThrow();
        assertThat(updated.launchUpdates()).isFalse();
        assertThat(stored.isLaunchUpdates()).isFalse();

        service.updateNotificationPreferences("bird@example.com", new NotificationPreferencesDTO(true));
        assertThat(repository.findById(stored.getId()).orElseThrow().isLaunchUpdates()).isTrue();
        service.deleteCurrent("bird@example.com");
        stored = repository.findById(stored.getId()).orElseThrow();
        assertThat(stored.isLaunchUpdates()).isFalse();
    }
}
