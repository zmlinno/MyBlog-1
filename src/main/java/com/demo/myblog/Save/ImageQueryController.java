package com.demo.myblog.Save;

import com.demo.myblog.PhotoAPI.UploadedImage;
import com.demo.myblog.PhotoAPI.UploadedImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ImageQueryController
{
    @Autowired
    private UploadedImageRepository imageRepository;

    @GetMapping("/saved-images")
    public List<String>getSavedImages()
    {
        List<UploadedImage>list = imageRepository.findAll();
        return list.stream().map(img->"/images/" + img.getFileName()).collect(Collectors.toList());

    }

}
