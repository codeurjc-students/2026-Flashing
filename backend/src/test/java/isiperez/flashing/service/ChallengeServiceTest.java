package isiperez.flashing.service;

import isiperez.flashing.dto.ChallengeDTO;
import isiperez.flashing.dto.ChallengeMapper;
import isiperez.flashing.model.Challenge;
import isiperez.flashing.model.ChallengeType;
import isiperez.flashing.repository.ChallengeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ChallengeServiceTest {

    @Mock
    private ChallengeRepository repository;

    @Mock
    private ChallengeMapper mapper;

    @InjectMocks
    private ChallengeService service;

    @Test
    void findAllShouldReturnMapperChallenges(){
        List<Challenge> storedChallenges = List.of(
            new Challenge(
                "Foto doble", 
                "Haz dos fotos relacionadas",
                ChallengeType.DOUBLE_PHOTO,
                60),
            new Challenge(
                "Dibujo rápido", 
                "Dibuja un objeto en poco tiempo",
                ChallengeType.QUICK_DRAWING,
                30));

        List<ChallengeDTO> expectedChallenges = List.of(
                new ChallengeDTO(
                        1L,
                        "Foto doble",
                        "Haz dos fotos relacionadas",
                        ChallengeType.DOUBLE_PHOTO,
                        60
                ),
                new ChallengeDTO(
                        2L,
                        "Dibujo rápido",
                        "Dibuja un objeto en poco tiempo",
                        ChallengeType.QUICK_DRAWING,
                        30
                )
        );

        when(repository.findAllByOrderByIdAsc())
            .thenReturn(storedChallenges);

        when(mapper.toDTOs(storedChallenges))
            .thenReturn(expectedChallenges);

        
        List<ChallengeDTO> result = service.findAll();

        assertThat(result).containsExactlyElementsOf(expectedChallenges);
        verify(repository).findAllByOrderByIdAsc();
        verify(mapper).toDTOs(storedChallenges);
    
        
    }
    
}
