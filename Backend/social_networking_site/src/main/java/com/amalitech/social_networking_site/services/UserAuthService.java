package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.auth.OauthUserCreationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.UserAuthenticationResponse;
import com.amalitech.social_networking_site.entities.Role;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTAuthenticationService jwtAuthenticationService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;


    public String register(UserCreationRequest userData) throws MessagingException, IOException {

        try {
            // TODO: input validation
            User user = User.builder()
                    .fullName(userData.fullname())
                    .username(userData.username())
                    .email(userData.email())
                    .role(Role.REG_USER)
                    .password(passwordEncoder.encode(userData.password()))
                    .isActive(false)
                    .build();


            User savedUser = userRepository.save(user);

            String generatedToken = jwtAuthenticationService.generateToken(savedUser.getEmail());

            emailService.emailVerification(savedUser.getEmail(), savedUser.getUsername(), generatedToken);

            return String.format("Account created successfully! We've sent a verification link to you email - %s", savedUser.getEmail());
        } catch (DataIntegrityViolationException err) {
            throw new IllegalArgumentException("username or email is already in use.");
        } catch (MessagingException err) {
            throw new IllegalArgumentException("error occurred when sending email. Email server must be down.");
        }

    }

    public UserAuthenticationResponse authenticate(UserAuthenticationRequest userData) {

        User user = userRepository.findByEmail(userData.email()).orElseThrow(() -> new IllegalArgumentException("user does not exist. Sign up now!"));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Your account is not verified");
        }

        if(user.getPassword() == null){
            throw new IllegalArgumentException("Your haven't set a password for your account. Click forgot password link to set it now!");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userData.email(),
                        userData.password()
                )
        );

        String generatedToken = jwtAuthenticationService.generateToken(userData.email());


        return new UserAuthenticationResponse("You are logged in", generatedToken);
    }


    public UserAuthenticationResponse OauthLoginService(OauthUserCreationRequest oauthUserData) {

        Optional<User> optionalUser = userRepository.findByEmail(oauthUserData.email());

        if (optionalUser.isEmpty()) {
            User user = User.builder()
                    .email(oauthUserData.email())
                    .fullName(oauthUserData.fullname())
                    .isActive(true)
                    .role(Role.REG_USER)
                    .build();
            userRepository.save(user);
        }

        String generatedToken = jwtAuthenticationService.generateToken(oauthUserData.email());

        return new UserAuthenticationResponse("Access granted. You're now logged in.", generatedToken);

    }

    public void emailVerification(String token) {

        if (jwtAuthenticationService.isValidToken(token)) {

            User user = userRepository.findByEmail(jwtAuthenticationService.extractUserEmail(token)).orElseThrow();

            user.setIsActive(true);
            userRepository.save(user);
            return;
        }

        throw new IllegalArgumentException("wrong verification token");
    }

}
