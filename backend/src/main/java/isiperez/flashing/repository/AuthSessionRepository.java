package isiperez.flashing.repository;

import isiperez.flashing.model.AuthSession;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthSessionRepository extends JpaRepository<AuthSession, String> {
    boolean existsByIdAndExpiresAtAfter(String id, Instant now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AuthSession s where s.id = :id")
    Optional<AuthSession> findForUpdate(@Param("id") String id);
}
