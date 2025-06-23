package com.demo.myblog.PhotoAPI;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadedImageRepository extends JpaRepository<UploadedImage,Long>

{
    List<UploadedImage> findByFileName(String fileName);

}
