package isiperez.flashing.service;

import isiperez.flashing.model.Challenge;
import isiperez.flashing.model.ChallengeType;
import isiperez.flashing.repository.ChallengeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ChallengeRepository repository;

    public DatabaseInitializer(ChallengeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.saveAll(List.of(
                new Challenge("Algo azul", "Fotografía algo azul que tengas cerca.", ChallengeType.GUIDED_PHOTO, 120),
                new Challenge("Tu lugar favorito", "Dibuja tu lugar favorito.", ChallengeType.QUICK_DRAWING, 180),
                new Challenge("Tu día en cinco palabras", "Describe tu día en cinco palabras.", ChallengeType.SHORT_TEXT, 60)
            ));
        }
    }
}
