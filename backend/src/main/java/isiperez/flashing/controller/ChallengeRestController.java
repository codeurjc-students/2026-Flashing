package isiperez.flashing.controller;

import isiperez.flashing.dto.ChallengeDTO;
import isiperez.flashing.service.ChallengeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/challenges")
public class ChallengeRestController {
    private final ChallengeService service;

    public ChallengeRestController(ChallengeService service) {
        this.service = service;
    }

    @GetMapping
    public List<ChallengeDTO> findAll() {
        return service.findAll();
    }
}
