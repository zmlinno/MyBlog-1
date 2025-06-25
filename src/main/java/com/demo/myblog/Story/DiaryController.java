package com.demo.myblog.Story;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/diary")
@CrossOrigin
public class DiaryController {
    @Autowired
    private DiaryRepository diaryRepository;

    @GetMapping
    public List<Diary> getAll() {
        return diaryRepository.findAll();
    }

    @PostMapping
    public Diary create(@RequestBody Diary diary) {
        diary.setCreateTime(LocalDateTime.now());
        return diaryRepository.save(diary);
    }

    @PutMapping("/{id}")
    public Diary update(@PathVariable Long id, @RequestBody Diary diary) {
        Optional<Diary> optional = diaryRepository.findById(id);
        if (optional.isPresent()) {
            Diary d = optional.get();
            d.setContent(diary.getContent());
            return diaryRepository.save(d);
        }
        throw new RuntimeException("日记不存在");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        diaryRepository.deleteById(id);
    }
} 