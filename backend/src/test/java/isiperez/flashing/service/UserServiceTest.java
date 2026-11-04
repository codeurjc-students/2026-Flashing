package isiperez.flashing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import isiperez.flashing.dto.RegisterUserDTO;
import isiperez.flashing.dto.NotificationPreferencesDTO;
import isiperez.flashing.dto.UserDTO;
import isiperez.flashing.dto.UserMapper;
import isiperez.flashing.model.User;
import isiperez.flashing.model.UserRole;
import isiperez.flashing.model.UserStatus;
import isiperez.flashing.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository repository;
    @Mock UserMapper mapper;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks UserService service;

    @Test
    void registerShouldEncodePasswordAndCreateRegularActiveUser() {
        RegisterUserDTO request = new RegisterUserDTO("isi", "Isi Pérez", "isi@example.com",
            "Password_1", "Europe/Madrid", null);
        UserDTO expected = new UserDTO(null, "isi", "Isi Pérez", "isi@example.com", UserRole.USER,
            "Europe/Madrid", null, null, UserStatus.ACTIVE, false);
        when(passwordEncoder.encode("Password_1")).thenReturn("encoded-password");
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toDTO(any(User.class))).thenReturn(expected);

        UserDTO result = service.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(repository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("encoded-password");
        assertThat(userCaptor.getValue().getRole()).isEqualTo(UserRole.USER);
        assertThat(userCaptor.getValue().getStatus()).isEqualTo(UserStatus.ACTIVE);
        assertThat(userCaptor.getValue().isLaunchUpdates()).isFalse();
        assertThat(userCaptor.getValue().getLaunchUpdatesConsentAt()).isNull();
        assertThat(result).isEqualTo(expected);
    }

    @Test
    void registrationShouldRecordOnlyTheSelectedEmailSubscription() {
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        service.register(new RegisterUserDTO("earlybird", "Early bird", "bird@example.com",
            "Password_1", "Europe/Madrid", true));

        ArgumentCaptor<User> captured = ArgumentCaptor.forClass(User.class);
        verify(repository).save(captured.capture());
        assertThat(captured.getValue().isLaunchUpdates()).isTrue();
        assertThat(captured.getValue().getLaunchUpdatesConsentAt()).isNotNull();
    }

    @Test
    void preferencesShouldApplyToTheAuthenticatedUserWithoutChangingTheirRole() {
        User user = new User("earlybird", "Early bird", "bird@example.com", "hash",
            UserRole.USER, "UTC");
        user.updateNotificationPreferences(true);
        when(repository.findByEmailIgnoreCase("bird@example.com")).thenReturn(Optional.of(user));

        service.updateNotificationPreferences("bird@example.com", new NotificationPreferencesDTO(false));

        assertThat(user.isLaunchUpdates()).isFalse();
        assertThat(user.getRole()).isEqualTo(UserRole.USER);
        verify(mapper).toDTO(user);
    }
}
