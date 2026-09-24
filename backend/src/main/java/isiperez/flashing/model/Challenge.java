package isiperez.flashing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String prompt;

    @Enumerated(EnumType.STRING)
    private ChallengeType type;

    private int durationSeconds;

    protected Challenge() {
    }

    public Challenge(String title, String prompt, ChallengeType type, int durationSeconds) {
        this.title = title;
        this.prompt = prompt;
        this.type = type;
        this.durationSeconds = durationSeconds;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPrompt() { return prompt; }
    public ChallengeType getType() { return type; }
    public int getDurationSeconds() { return durationSeconds; }
}
