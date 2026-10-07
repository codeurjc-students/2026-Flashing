package isiperez.flashing.integration;

import isiperez.flashing.dto.ChallengeDTO;
import isiperez.flashing.model.Challenge;
import isiperez.flashing.model.ChallengeType;
import isiperez.flashing.repository.ChallengeRepository;
import isiperez.flashing.service.ChallengeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
class ChallengeServiceIT {

    @Container
    @ServiceConnection
    static final MySQLContainer MYSQL =
            new MySQLContainer("mysql:9.6")
                    .withDatabaseName("flashing_test")
                    .withUsername("flashing_test")
                    .withPassword("flashing_test");

    @Autowired
    private ChallengeService service;

    @Autowired
    private ChallengeRepository repository;

    private List<Challenge> savedChallenges;

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        savedChallenges = repository.saveAllAndFlush(List.of(
                new Challenge(
                        "Primer reto de integración",
                        "Descripción del primer reto",
                        ChallengeType.GUIDED_PHOTO,
                        120
                ),
                new Challenge(
                        "Segundo reto de integración",
                        "Descripción del segundo reto",
                        ChallengeType.SHORT_TEXT,
                        60
                )
        ));
    }

    @Test
    void findAllShouldReturnChallengesStoredInMySqlOrderedById() {
        List<ChallengeDTO> result = service.findAll();

        assertThat(result).hasSize(2);

        assertThat(result)
                .extracting(ChallengeDTO::id)
                .containsExactly(
                        savedChallenges.get(0).getId(),
                        savedChallenges.get(1).getId()
                );

        assertThat(result)
                .extracting(ChallengeDTO::title)
                .containsExactly(
                        "Primer reto de integración",
                        "Segundo reto de integración"
                );

        assertThat(result)
                .extracting(ChallengeDTO::prompt)
                .containsExactly(
                        "Descripción del primer reto",
                        "Descripción del segundo reto"
                );

        assertThat(result)
                .extracting(ChallengeDTO::type)
                .containsExactly(
                        ChallengeType.GUIDED_PHOTO,
                        ChallengeType.SHORT_TEXT
                );

        assertThat(result)
                .extracting(ChallengeDTO::durationSeconds)
                .containsExactly(120, 60);
    }
}
