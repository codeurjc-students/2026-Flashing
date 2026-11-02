package isiperez.flashing.service;

import isiperez.flashing.model.Challenge;
import isiperez.flashing.model.ChallengeType;
import isiperez.flashing.repository.ChallengeRepository;
import isiperez.flashing.model.User;
import isiperez.flashing.model.UserRole;
import isiperez.flashing.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(ChallengeRepository challengeRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (challengeRepository.count() == 0) {
            challengeRepository.saveAll(List.of(
                new Challenge("Algo azul", "Fotografía algo azul que tengas cerca.", ChallengeType.GUIDED_PHOTO, 120),
                new Challenge("Tu lugar favorito", "Dibuja tu lugar favorito.", ChallengeType.QUICK_DRAWING, 180),
                new Challenge("Tu día en cinco palabras", "Describe tu día en cinco palabras.", ChallengeType.SHORT_TEXT, 60)
            ));
        }
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                new User("admin", "Flashing administrator", "admin@flashing.local",
                    passwordEncoder.encode("Admin_2026"), UserRole.ADMIN, "Europe/Madrid"),
                new User("demo", "Demo user", "demo@flashing.local",
                    passwordEncoder.encode("Demo_2026"), UserRole.USER, "Europe/Madrid")
            ));
        }
    }
}
