package com.amalitech.social_networking_site.controllers.auth;

import com.amalitech.social_networking_site.dto.requests.auth.OauthUserCreationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.PasswordResetRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.ErrorMessage;
import com.amalitech.social_networking_site.dto.response.SuccessMessage;
import com.amalitech.social_networking_site.services.UserAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserAuthService userAuthService;

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody UserCreationRequest userData) {

        try {
            String message = userAuthService.register(userData);
            return ResponseEntity.ok(new SuccessMessage(message));
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> login(@RequestBody UserAuthenticationRequest userData) {

        try {
            var message = userAuthService.authenticate(userData);
            return ResponseEntity.ok(message);
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }

    @GetMapping("/account_verification/{token}")
    public RedirectView emailVerification(@PathVariable String token) {

        try {
            userAuthService.emailVerification(token);
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("http://localhost:3000/");
            return redirectView;
        } catch (Exception err) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, err.getMessage());
        }
    }

    @PutMapping("/password_reset")
    public ResponseEntity<?> passwordReset(@RequestBody PasswordResetRequest userData){

        try {
             var message = userAuthService.passwordReset(userData.email());
             return ResponseEntity.ok(new SuccessMessage(message));
        }catch (Exception err){
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }

    }

    @PostMapping("/oauth/registration")
    public ResponseEntity<?> OauthUserRegistration(@RequestBody OauthUserCreationRequest authData) {
        try {
            var response = userAuthService.OauthLoginService(authData);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }
}
