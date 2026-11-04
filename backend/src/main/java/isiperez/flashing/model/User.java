package isiperez.flashing.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
    @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String displayName;
    private String email;
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    private String timezone;
    private Instant createdAt;
    private Instant lastLoginAt;
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    private boolean launchUpdates;
    private Instant launchUpdatesConsentAt;

    protected User() {
    }

    public User(String username, String displayName, String email, String passwordHash, UserRole role,
            String timezone) {
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.timezone = timezone;
        this.createdAt = Instant.now();
        this.status = UserStatus.ACTIVE;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public UserRole getRole() { return role; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public boolean isLaunchUpdates() { return launchUpdates; }
    public Instant getLaunchUpdatesConsentAt() { return launchUpdatesConsentAt; }

    public void updateNotificationPreferences(boolean launchUpdates) {
        if (launchUpdates && !this.launchUpdates) launchUpdatesConsentAt = Instant.now();
        this.launchUpdates = launchUpdates;
    }
}
