package com.amalitech.social_networking_site.services;

import static com.amalitech.social_networking_site.utilities.Utilities.*;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JWTAuthenticationService {

    @Value("${spring.security.token.secretKey}")
    private String jwtAuthSecretKey;

    @Value("${spring.security.token.expiredTime}")
    private int jwtAuthExpiredTime;

    public String extractUserEmail(String token) {

        return extractClaim(token, (claims)-> claims.get("email", String.class) );
    }

    private Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    public String generateToken(String email, TokenSubject subject) {

        HashMap<String, String> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", Role.REG_USER.name());

        return Jwts.builder()
                .claims(claims)
                .subject(subject.name())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtAuthExpiredTime))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isValidToken(String token, TokenSubject tokenSubject) {

        return !isTokenExpired(token) && getTokenSubject(token).equals(tokenSubject.name());
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    private String getTokenSubject(String token){
        return extractClaim(token, (Claims::getSubject));
    }


    private SecretKey getSignInKey() {

        byte[] keyBytes = Decoders.BASE64.decode(jwtAuthSecretKey);
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
