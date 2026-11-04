package isiperez.flashing.controller;

import isiperez.flashing.dto.RegisterUserDTO;
import isiperez.flashing.dto.NotificationPreferencesDTO;
import isiperez.flashing.dto.UpdateUserDTO;
import isiperez.flashing.dto.UserDTO;
import isiperez.flashing.service.UserService;
import isiperez.flashing.security.AuthenticationCookies;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {
    private final UserService service;
    private final AuthenticationCookies cookies;

    public UserRestController(UserService service, AuthenticationCookies cookies) {
        this.service = service;
        this.cookies = cookies;
    }

    @PostMapping
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterUserDTO request) {
        UserDTO created = service.register(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/me").build().toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/me")
    public UserDTO findCurrent(Principal principal) {
        return service.findCurrent(principal.getName());
    }

    @GetMapping
    public Page<UserDTO> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    @PutMapping("/me")
    public UserDTO updateCurrent(Principal principal, @Valid @RequestBody UpdateUserDTO request) {
        return service.updateCurrent(principal.getName(), request);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrent(Principal principal,
            HttpServletResponse response) {
        service.deleteCurrent(principal.getName());
        cookies.clear(response);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/notifications")
    public UserDTO updateNotificationPreferences(Principal principal,
            @Valid @RequestBody NotificationPreferencesDTO request) {
        return service.updateNotificationPreferences(principal.getName(), request);
    }
}
