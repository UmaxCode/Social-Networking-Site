package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.UserAuthenticationResponse;
import com.amalitech.social_networking_site.entities.Role;
import com.amalitech.social_networking_site.entities.Token;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.repositories.TokenRepository;
import com.amalitech.social_networking_site.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.SQLException;

@Service
@RequiredArgsConstructor
public class UserAuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTAuthenticationService jwtAuthenticationService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;


    public String register(UserCreationRequest userData) throws MessagingException, IOException {

        User user = null;
       try{
           // TODO: input validation

            user = User.builder()
                   .fullName(userData.fullname())
                   .username(userData.username())
                   .email(userData.email())
                   .role(Role.REG_USER)
                   .password(passwordEncoder.encode(userData.password()))
                   .isActive(false)
                   .build();


           User savedUser = this.userRepository.save(user);

           String generatedToken = this.jwtAuthenticationService.generateToken(savedUser.getEmail());

           Token token = Token.builder()
                   .token(generatedToken)
                   .user(user)
                   .isExpired(false)
                   .isRevoked(false)
                   .build();

           this.tokenRepository.save(token);

           // TODO: handle exception when sending email

           this.emailService.emailVerification(savedUser.getEmail(), savedUser.getUsername(), generatedToken);

           return String.format("Account created successfully! We've sent a verification link to you email - %s", savedUser.getEmail());
       }catch (DataIntegrityViolationException err){
             throw new IllegalArgumentException("username or email is already in use.");
       }catch (MessagingException err){
           this.userRepository.delete(user);
           throw new IllegalArgumentException("error occurred when sending email.");
       }

    }

    public UserAuthenticationResponse authenticate(UserAuthenticationRequest userData) {

        User user = this.userRepository.findByEmail(userData.email()).orElseThrow(() -> new IllegalArgumentException("user does not exist. Sign up now!"));

        // TODO: check for account verification
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Your account is not verified");
        }


        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userData.email(),
                        userData.password()
                )
        );


        // TODO: check for any revoked token in the database and remove it

        removedRevokedOrExpiredToken(user.getToken().getToken());

        String generatedToken = this.jwtAuthenticationService.generateToken(userData.email());

        Token token = Token.builder()
                .user(user)
                .token(generatedToken)
                .isRevoked(false)
                .isExpired(false)
                .build();

        Token savedToken = this.tokenRepository.save(token);


        return new UserAuthenticationResponse("You are logged in", savedToken.getToken());
    }

    public void emailVerification(String token) {

        boolean isValidToken = this.tokenRepository.findByToken(token).isPresent();
        if (isValidToken) {

            User user = this.userRepository.findByEmail(jwtAuthenticationService.extractUserEmail(token)).orElseThrow();

            user.setIsActive(true);
            this.userRepository.save(user);
            return;
        }

        throw new IllegalArgumentException("wrong verification token");
    }

    private void removedRevokedOrExpiredToken(String token) {

        Token savedToken = this.tokenRepository.findByToken(token).orElseThrow();
        this.tokenRepository.delete(savedToken);
    }
}
