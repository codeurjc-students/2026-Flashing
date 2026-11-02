package isiperez.flashing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import isiperez.flashing.dto.RegisterUserDTO;
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

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository repository;
    @Mock UserMapper mapper;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks UserService service;

    @Test
    void registerShouldEncodePasswordAndCreateRegularActiveUser() {
        RegisterUserDTO request = new RegisterUserDTO("isi", "Isi Pérez", "isi@example.com",
            "Password_1", "Europe/Madrid");
        UserDTO expected = new UserDTO(null, "isi", "Isi Pérez", "isi@example.com", UserRole.USER,
            "Europe/Madrid", null, null, UserStatus.ACTIVE);
        when(passwordEncoder.encode("Password_1")).thenReturn("encoded-password");
        when(repository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mapper.toDTO(any(User.class))).thenReturn(expected);

        UserDTO result = service.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(repository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("encoded-password");
        assertThat(userCaptor.getValue().getRole()).isEqualTo(UserRole.USER);
        assertThat(userCaptor.getValue().getStatus()).isEqualTo(UserStatus.ACTIVE);
        assertThat(result).isEqualTo(expected);
    }
}
