package isiperez.flashing.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.Instant;

@Entity
public class AuthSession {
    @Id
    private String id;
    private String refreshId;
    private Instant expiresAt;

    protected AuthSession() {
    }

    public AuthSession(String id, String refreshId, Instant expiresAt) {
        this.id = id;
        rotate(refreshId, expiresAt);
    }

    public String getRefreshId() {
        return refreshId;
    }

    public void rotate(String refreshId, Instant expiresAt) {
        this.refreshId = refreshId;
        this.expiresAt = expiresAt;
    }
}
