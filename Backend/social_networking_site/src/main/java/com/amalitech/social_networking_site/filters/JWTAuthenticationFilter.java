package com.amalitech.social_networking_site.filters;

import com.amalitech.social_networking_site.services.JWTAuthenticationService;
import static com.amalitech.social_networking_site.utilities.Utilities.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTAuthenticationService jwtAuthenticationService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwtToken = authHeader.substring(7);

       try {
           String userEmail = jwtAuthenticationService.extractUserEmail(jwtToken);

           if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

               UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
               if (jwtAuthenticationService.isValidToken(jwtToken, TokenSubject.LOGIN)) {

                   UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                           userDetails,
                           null,
                           userDetails.getAuthorities()
                   );

                   authToken.setDetails(
                           new WebAuthenticationDetailsSource().buildDetails(request)
                   );

                   SecurityContextHolder.getContext().setAuthentication(authToken);

               }
           }


           filterChain.doFilter(request, response);
       }catch (Exception err){

           throw new IllegalArgumentException(err.getMessage());
       }
    }
}
