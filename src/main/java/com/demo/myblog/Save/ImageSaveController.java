package com.demo.myblog.Save;

import com.demo.myblog.PhotoAPI.UploadedImage;
import com.demo.myblog.PhotoAPI.UploadedImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
public class ImageSaveController
{
    @Autowired
    private UploadedImageRepository imageRepository;

    @PostMapping("/save-images")
    public Map<String,Object>saveImages(@RequestBody Map<String, List<String>> request)
    {
        List<String>imageUrls = request.get("imageUrls");
        for(String url:imageUrls)
        {
            String fileName = url.substring(url.lastIndexOf("/")+1);

            //保存前，先检查数据库是否存在该文件名都记录
            if(imageRepository.findByFileName(fileName).isEmpty())
            {
                UploadedImage image=new UploadedImage();
                image.setFileName(fileName);
                image.setUploadTime(new Timestamp(System.currentTimeMillis()));
                imageRepository.save(image);
            }
        }
        return Map.of("message","success");
    }

    //临时添加 - 用于清空所有图片记录和物理文件
    @PostMapping("/admin/clear-all")
    public Map<String,String>clearAll()
    {
        //1.删除数据库所有记录
        imageRepository.deleteAll();

        return Map.of("message","All images and records cleared successfully!");
    }

}
