package isiperez.flashing.dto;

import isiperez.flashing.model.Challenge;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ChallengeMapper {
    ChallengeDTO toDTO(Challenge challenge);

    List<ChallengeDTO> toDTOs(List<Challenge> challenges);
}
