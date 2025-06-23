package com.demo.myblog.PhotoAPI;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class UploadController
{
    @Autowired
    private UploadedImageRepository imageRepository;

    @PostMapping("upload")
    public Map<String,Object> handleFileUpload(@RequestParam("file") MultipartFile file)
    {
        Map<String,Object> response = new HashMap<>();

        try {
            //获取target/classes/static/images目录
           // Path uploadPath = Paths.get(ResourceUtils.getURL("classpath:static/images/").toURI());
           Path uploadPath = Paths.get("target/classes/static/images/");

            //如果目录不存在，则创建
            if(!Files.exists(uploadPath))
            {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            //保存文件
            Files.write(filePath,file.getBytes());

            //保存到数据库
            UploadedImage image = new UploadedImage();
            image.setFileName(fileName);
            image.setUploadTime(new Timestamp(System.currentTimeMillis()));
            imageRepository.save(image);


            response.put("status","success");
            response.put("imageUrl","/images/" + fileName);
        }catch(Exception e)
        {
            e.printStackTrace();
            response.put("status","fail");
            response.put("message",e.getMessage());
        }
        return response;
    }

    @GetMapping("/images")
    public List<String> getAllImages()
    {
        return imageRepository.findAll().stream()
                .map(UploadedImage::getFileName)
                .toList();
    }

   

    @Configuration
    public class WebConfig implements WebMvcConfigurer
    {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry)
        {
            registry.addResourceHandler("/images/**")
                    .addResourceLocations("classpath:/static/images/");
        }
    }

}
