package isiperez.flashing.system;

import isiperez.flashing.TestcontainersConfiguration;
import isiperez.flashing.model.Challenge;
import isiperez.flashing.model.ChallengeType;
import isiperez.flashing.repository.ChallengeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class ChallengeApiSystemIT {

    @LocalServerPort
    private int port;

    @Autowired
    private ChallengeRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        repository.saveAllAndFlush(List.of(
                new Challenge(
                        "Algo azul",
                        "Fotografía algo azul que tengas cerca.",
                        ChallengeType.GUIDED_PHOTO,
                        120
                ),
                new Challenge(
                        "Tu lugar favorito",
                        "Dibuja tu lugar favorito.",
                        ChallengeType.QUICK_DRAWING,
                        180
                ),
                new Challenge(
                        "Tu día en cinco palabras",
                        "Describe tu día en cinco palabras.",
                        ChallengeType.SHORT_TEXT,
                        60
                )
        ));
    }

    @Test
    void getChallengesShouldReturnSampleData() {
        given()
                .port(port)
                .accept("application/json")
        .when()
                .get("/api/v1/challenges")
        .then()
                .statusCode(200)
                .contentType("application/json")
                .body("size()", equalTo(3))
                .body("[0].title", equalTo("Algo azul"))
                .body("[0].prompt", equalTo("Fotografía algo azul que tengas cerca."))
                .body("[0].type", equalTo("GUIDED_PHOTO"))
                .body("[0].durationSeconds", equalTo(120))
                .body("[1].title", equalTo("Tu lugar favorito"))
                .body("[2].title", equalTo("Tu día en cinco palabras"));
    }
}
