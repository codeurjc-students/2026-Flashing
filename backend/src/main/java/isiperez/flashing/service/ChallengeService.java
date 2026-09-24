package isiperez.flashing.service;

import isiperez.flashing.dto.ChallengeDTO;
import isiperez.flashing.dto.ChallengeMapper;
import isiperez.flashing.repository.ChallengeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChallengeService {
    private final ChallengeRepository repository;
    private final ChallengeMapper mapper;

    public ChallengeService(ChallengeRepository repository, ChallengeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<ChallengeDTO> findAll() {
        return mapper.toDTOs(repository.findAllByOrderByIdAsc());
    }
}
