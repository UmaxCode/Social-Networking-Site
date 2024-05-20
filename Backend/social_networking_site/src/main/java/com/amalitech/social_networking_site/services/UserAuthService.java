package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.auth.UserAuthenticationRequest;
import com.amalitech.social_networking_site.dto.requests.auth.UserCreationRequest;
import com.amalitech.social_networking_site.dto.response.UserAuthenticationResponse;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.entities.UserProfile;
import com.amalitech.social_networking_site.repositories.ProfileRepository;
import com.amalitech.social_networking_site.repositories.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

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
    private final JwtDecoder jwtDecoder;

    @Value("${spring.security.oauth2.client.registration.google.clientId}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.clientSecret}")
    private String clientSecret;
    @Value("${frontend.url}")
    private String frontEndUrl;


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

            var profile = UserProfile.builder()
                    .user(savedUser)

                    .build();

            profileRepository.save(profile);

            String generatedToken = jwtAuthenticationService.generateToken(savedUser.getEmail(), TokenSubject.EMAIL_VERIFICATION);

            emailService.sendMail("email Account Verification", "email_verification.html", savedUser.getEmail(), savedUser.getUsername(), generatedToken);

            return String.format("Account created successfully! We've sent a verification link to you email - %s", savedUser.getEmail());
        } catch (DataIntegrityViolationException err) {
            throw new IllegalArgumentException("username or email is already in use.");
        } catch (MessagingException err) {
            throw new IllegalArgumentException("error occurred when sending email. email server must be down.");
        }

    }

    public UserAuthenticationResponse authenticate(UserAuthenticationRequest userData) {

        User user = userRepository.findByEmail(userData.email()).orElseThrow(() -> new IllegalArgumentException("user does not exist. Sign up now!"));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Your account is not verified");
        }

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("Your haven't set a password for your account. Click forgot password link to set it now!");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userData.email(),
                        userData.password()
                )
        );

        String generatedToken = jwtAuthenticationService.generateToken(userData.email(), TokenSubject.LOGIN);


        return new UserAuthenticationResponse("You are logged in", generatedToken, user.getUsername(), user.getProfile().getFilePath());
    }


    private UserAuthenticationResponse registerOauthUser (String token){


       var  claims =  jwtDecoder.decode(token);

       var body = claims.getClaims();

        String email = String.valueOf(body.get("email"));

        String firstname = String.valueOf(body.get("given_name"));

        String lastname = String.valueOf(body.get("family_name"));

//        String picture = String.valueOf(body.get("picture"));


        Optional<User> optionalUser = userRepository.findByEmail(email);

        User savedUser;

        if (optionalUser.isEmpty()) {

            User user = User.builder()
                    .email(email)
                    .fullName(firstname + " " + lastname)
                    .isActive(true)
                    .username(firstname + (UUID.randomUUID()).toString().split("-")[0])
                    .role(Role.REG_USER)

                    .build();
            savedUser = userRepository.save(user);

            var profile = UserProfile.builder()
                    .user(savedUser)
                    .onlineStatus(false)
                    .build();

            profileRepository.save(profile);

            savedUser.setProfile(profile);

            userRepository.save(savedUser);


        }else {
            savedUser = optionalUser.get();
        }

        String generatedToken = jwtAuthenticationService.generateToken(email, TokenSubject.LOGIN);

        return new UserAuthenticationResponse("Access granted. You're now logged in.", generatedToken, savedUser.getUsername(), savedUser.getProfile().getFilePath());

    }


    public UserAuthenticationResponse handleGoogleCallback(String code) {

        try {
            String token = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(), new GsonFactory(),
                    clientId,
                    clientSecret,
                    code,
                    frontEndUrl
            ).execute().getIdToken();


            return registerOauthUser(token);

        } catch (IOException e) {
            System.err.println(e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google OAuth failed", e);
        }

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

    public void emailVerification(String token) {

        if (jwtAuthenticationService.isValidToken(token, TokenSubject.EMAIL_VERIFICATION)) {

            User user = userRepository.findByEmail(jwtAuthenticationService.extractUserEmail(token)).orElseThrow();

            user.setIsActive(true);
            userRepository.save(user);
            return;
        }

        throw new IllegalArgumentException("wrong verification token");
    }

}
