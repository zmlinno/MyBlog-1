package com.demo.myblog.Family;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/family")
@CrossOrigin
public class FamilyMemberController {
    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @GetMapping
    public List<FamilyMember> getAll() {
        return familyMemberRepository.findAll();
    }

    @PostMapping
    public FamilyMember create(@RequestBody FamilyMember member) {
        return familyMemberRepository.save(member);
    }

    @PutMapping("/{id}")
    public FamilyMember update(@PathVariable Long id, @RequestBody FamilyMember member) {
        Optional<FamilyMember> optional = familyMemberRepository.findById(id);
        if (optional.isPresent()) {
            FamilyMember m = optional.get();
            m.setName(member.getName());
            m.setRelation(member.getRelation());
            m.setBirthday(member.getBirthday());
            m.setPhotoUrl(member.getPhotoUrl());
            return familyMemberRepository.save(m);
        }
        throw new RuntimeException("成员不存在");
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        familyMemberRepository.deleteById(id);
    }
} 