package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.repositories.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JWTAuthenticationService {

    private final TokenRepository tokenRepository;

    @Value("${spring.security.token.secretKey}")
    private String jwtAuthSecretKey;

    @Value("${spring.security.token.expiredTime}")
    private int jwtAuthExpiredTime;

    public String extractUserEmail(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + this.jwtAuthExpiredTime))
                .signWith(getSignInKey())
                .compact();
    }


    public boolean isValidToken(String token) {

        return !isTokenExpired(token) && !isTokenRevoked(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    private boolean isTokenRevoked(String token) {
        return this.tokenRepository.findByToken(token).isEmpty();
    }


    private SecretKey getSignInKey() {

        byte[] keyBytes = Decoders.BASE64.decode(this.jwtAuthSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {


        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }
}
