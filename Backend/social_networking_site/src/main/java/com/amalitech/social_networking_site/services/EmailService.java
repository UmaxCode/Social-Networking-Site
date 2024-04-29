package com.amalitech.social_networking_site.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;


    @Async
    public void sendMail(String subject, String emailTemplate, String to, String username, String token) throws MessagingException, IOException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        mimeMessage.setFrom(new InternetAddress("umaxcodelearn@gmail.com"));
        mimeMessage.setRecipients(MimeMessage.RecipientType.TO, to);
        mimeMessage.setSubject(subject);

//        String htmlTemplate = readFile("email_verification.html");
        String htmlTemplate = readFile(emailTemplate);

        htmlTemplate = htmlTemplate.replace("${username}", username);
        htmlTemplate = htmlTemplate.replace("${token}", token);

        mimeMessage.setContent(htmlTemplate, "text/html; charset=utf-8");

        javaMailSender.send(mimeMessage);

    }

    private String readFile(String filename) throws IOException {

        ClassPathResource resource = new ClassPathResource("templates/" + filename);
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
        }
        return content.toString();
    }


}
