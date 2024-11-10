package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.UserAuthenticationResponse;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.entities.UserProfile;
import com.amalitech.social_networking_site.repositories.ProfileRepository;
import com.amalitech.social_networking_site.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.util.Optional;

import static com.amalitech.social_networking_site.utilities.Utilities.*;

@Service
@RequiredArgsConstructor
public class UserAuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTAuthenticationService jwtAuthenticationService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Value("${frontend.url}")
    private String frontEndUrl;


    public String register(UserCreationRequest userData) throws MessagingException, IOException {

        User user = User.builder()
                .fullName(userData.fullname())
                .username(userData.username())
                .email(userData.email())
                .role(Role.REG_USER)
                .password(passwordEncoder.encode(userData.password()))
                .build();


        User savedUser = userRepository.save(user);

        var profile = UserProfile.builder()
                .user(savedUser)
                .build();

        profileRepository.save(profile);

        String generatedToken = jwtAuthenticationService.generateToken(savedUser.getEmail(), TokenSubject.EMAIL_VERIFICATION);

        emailService.sendMail("email Account Verification", "email_verification.html", savedUser.getEmail(), savedUser.getUsername(), generatedToken);

        return String.format("Account created successfully! We've sent a verification link to you email - %s", savedUser.getEmail());


    }

    public UserAuthenticationResponse authenticate(UserAuthenticationRequest userData) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userData.email(),
                        userData.password()
                )
        );

        String generatedToken = jwtAuthenticationService.generateToken(userData.email(), TokenSubject.LOGIN);

        User user = (User) authentication.getPrincipal();

        return UserAuthenticationResponse.builder()
                .message("You are logged in")
                .token(generatedToken)
                .username(user.getUsername())
                .profile_pic(user.getProfile().getFilePath())
                .build();
    }


    public String passwordReset(String email) throws MessagingException, IOException {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Sorry, you don't have and account with us. You need to sign up.");
        }

        User user = optionalUser.get();

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Sorry, your account is not verified");
        }

        String generatedPassword = generatePassword();

        emailService.sendMail("Password Reset", "password_reset.html", user.getEmail(), user.getUsername(), generatedPassword);

        user.setPassword(passwordEncoder.encode(generatedPassword));
        userRepository.save(user);

        return "The password reset request was successful. Please check your email inbox for further instructions.";

    }

    public RedirectView emailVerification(String token) {

        if (jwtAuthenticationService.isValidToken(token, TokenSubject.EMAIL_VERIFICATION)) {

            User user = userRepository.findByEmail(jwtAuthenticationService.extractUserEmail(token)).orElseThrow();

            user.setIsActive(true);
            userRepository.save(user);

            RedirectView redirectView = new RedirectView();
            redirectView.setUrl(frontEndUrl);
            return redirectView;
        }

        throw new IllegalArgumentException("wrong verification token");
    }

}
