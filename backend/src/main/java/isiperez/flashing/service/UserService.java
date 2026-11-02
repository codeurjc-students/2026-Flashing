package isiperez.flashing.service;

import isiperez.flashing.dto.RegisterUserDTO;
import isiperez.flashing.dto.UpdateUserDTO;
import isiperez.flashing.dto.UserDTO;
import isiperez.flashing.dto.UserMapper;
import isiperez.flashing.exception.ConflictException;
import isiperez.flashing.exception.ResourceNotFoundException;
import isiperez.flashing.model.User;
import isiperez.flashing.model.UserRole;
import isiperez.flashing.model.UserStatus;
import isiperez.flashing.repository.UserRepository;
import java.time.Instant;
import java.time.ZoneId;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, UserMapper mapper, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDTO register(RegisterUserDTO request) {
        validatePassword(request.password());
        validateTimezone(request.timezone());
        if (repository.existsByUsernameIgnoreCase(request.username())) {
            throw new ConflictException("Username is already in use");
        }
        if (repository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("Email is already in use");
        }

        User user = new User(request.username().trim(), request.displayName().trim(),
            request.email().trim().toLowerCase(), passwordEncoder.encode(request.password()), UserRole.USER,
            request.timezone());
        return mapper.toDTO(repository.save(user));
    }

    @Transactional(readOnly = true)
    public UserDTO findCurrent(String email) {
        return mapper.toDTO(findActiveByEmail(email));
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDTO);
    }

    @Transactional
    public UserDTO updateCurrent(String email, UpdateUserDTO request) {
        validateTimezone(request.timezone());
        User user = findActiveByEmail(email);
        repository.findByUsernameIgnoreCase(request.username())
            .filter(existing -> !existing.getId().equals(user.getId()))
            .ifPresent(existing -> { throw new ConflictException("Username is already in use"); });

        user.setUsername(request.username().trim());
        user.setDisplayName(request.displayName().trim());
        user.setTimezone(request.timezone());
        return mapper.toDTO(user);
    }

    @Transactional
    public void deleteCurrent(String email) {
        User user = findActiveByEmail(email);
        user.setStatus(UserStatus.DELETED);
        user.setUsername("deleted_" + user.getId());
        user.setEmail("deleted_" + user.getId() + "@flashing.invalid");
        user.setDisplayName("Deleted user");
    }

    @Transactional
    public void recordLogin(String email) {
        User user = findActiveByEmail(email);
        user.setLastLoginAt(Instant.now());
    }

    public User findActiveByEmail(String email) {
        User user = repository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResourceNotFoundException("Active user not found");
        }
        return user;
    }

    private void validateTimezone(String timezone) {
        try {
            ZoneId.of(timezone);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Timezone is not valid");
        }
    }

    private void validatePassword(String password) {
        if (!password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,64}$")) {
            throw new IllegalArgumentException(
                "Password must contain uppercase, lowercase, number and special characters");
        }
    }
}
