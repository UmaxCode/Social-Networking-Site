package com.amalitech.social_networking_site.services;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map uploadFile(MultipartFile multipartFile) throws IOException {

        return cloudinary.uploader().upload(multipartFile.getBytes(), Map.of());

    }
}
