package com.amalitech.social_networking_site.controllers.auth;

import com.amalitech.social_networking_site.dto.requests.auth.PasswordResetRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.SuccessResponse;
import com.amalitech.social_networking_site.services.UserAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserAuthService userAuthService;

    @PostMapping("/signup")
    public ResponseEntity<SuccessResponse> signup(@RequestBody UserCreationRequest userData) throws Exception {

        String message = userAuthService.register(userData);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.builder()
                        .message(message)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse> login(@RequestBody UserAuthenticationRequest userData) {

        var response = userAuthService.authenticate(userData);

        return ResponseEntity.ok(SuccessResponse.builder()
                .data(response)
                .build());
    }

    @GetMapping("/account_verification/{token}")
    public RedirectView emailVerification(@PathVariable String token) {

        return userAuthService.emailVerification(token);
    }

    @PatchMapping("/password_reset")
    public ResponseEntity<SuccessResponse> passwordReset(@RequestBody PasswordResetRequest userData) throws Exception {

        var response = userAuthService.passwordReset(userData.email());

        return ResponseEntity.ok(SuccessResponse.builder()
                .message(response)
                .build());

    }
}
