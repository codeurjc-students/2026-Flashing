package isiperez.flashing.security;

import isiperez.flashing.model.User;
import isiperez.flashing.model.UserStatus;
import isiperez.flashing.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class RepositoryUserDetailsService implements UserDetailsService {
    private final UserRepository repository;

    public RepositoryUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = repository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        boolean active = user.getStatus() == UserStatus.ACTIVE;
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPasswordHash(),
            active, true, true, true,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
