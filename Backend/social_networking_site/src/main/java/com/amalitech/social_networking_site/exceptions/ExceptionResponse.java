package com.amalitech.social_networking_site.exceptions;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ExceptionResponse(String path, String message, LocalDateTime timestamp) {

}
