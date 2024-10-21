package com.amalitech.social_networking_site.components;

import com.amalitech.social_networking_site.services.JWTAuthenticationService;
import com.amalitech.social_networking_site.services.UserService;
import com.amalitech.social_networking_site.utilities.Utilities;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class WebSocketInterceptor implements HandshakeInterceptor {

    private final JWTAuthenticationService jwtAuthenticationService;
    private final UserService userService;

    @Override
    public boolean beforeHandshake(@NonNull ServerHttpRequest request,
                                   @NonNull ServerHttpResponse response,
                                   @NonNull WebSocketHandler wsHandler,
                                   @NonNull Map<String, Object> attributes) {

        String queryParam = request.getURI().getQuery();

        if (queryParam != null) {
            try {
                Map<String, String> queryParams = parseQuery(queryParam);
                String token = queryParams.get("token");

                if (jwtAuthenticationService.isValidToken(token, Utilities.TokenSubject.LOGIN)) {
                    String email = jwtAuthenticationService.extractUserEmail(token);
                    userService.getUserFromEmail(email);
                    response.setStatusCode(HttpStatus.OK);
                    return true;
                }


            } catch (Exception e) {
                // Handle exceptions such as missing parameters or other issues
                response.setStatusCode(HttpStatus.BAD_REQUEST);
                return false;
            }
        }

        response.setStatusCode(HttpStatus.BAD_REQUEST);
        return false;
    }


    // Helper method to parse the query string into a Map
    private Map<String, String> parseQuery(String query) {
        return Arrays.stream(query.split("&"))
                .map(param -> param.split("="))
                .collect(Collectors.toMap(
                        arr -> arr[0],
                        arr -> arr.length > 1 ? arr[1] : ""));
    }

    @Override
    public void afterHandshake(@NonNull ServerHttpRequest request,
                               @NonNull ServerHttpResponse response,
                               @NonNull WebSocketHandler wsHandler, Exception exception) {

        // do nothing
    }
}
