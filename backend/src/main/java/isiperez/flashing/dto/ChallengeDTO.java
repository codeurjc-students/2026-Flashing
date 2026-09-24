package isiperez.flashing.dto;

import isiperez.flashing.model.ChallengeType;

public record ChallengeDTO(Long id, String title, String prompt, ChallengeType type, int durationSeconds) {
}
