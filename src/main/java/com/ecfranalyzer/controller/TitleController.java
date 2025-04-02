package com.ecfranalyzer.controller;

import com.ecfranalyzer.model.Section;
import com.ecfranalyzer.model.Title;
import com.ecfranalyzer.repository.SectionRepository;
import com.ecfranalyzer.repository.TitleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/titles")
public class TitleController {

    @Autowired
    private TitleRepository titleRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @GetMapping
    public List<Title> getAllTitles() {
        return titleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Title> getTitleById(@PathVariable String id) {
        Optional<Title> title = titleRepository.findById(id);
        return title.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<Title> getTitleByNumber(@PathVariable String number) {
        // Updated to use the corrected method name
        Title title = titleRepository.findByTitleNumber(number);
        return title != null
                ? ResponseEntity.ok(title)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Title> searchTitles(@RequestParam String name) {
        return titleRepository.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}/sections")
    public List<Section> getSectionsByTitle(@PathVariable String id) {
        return sectionRepository.findByTitleId(id);
    }

    @GetMapping("/by-word-count")
    public List<Title> getTitlesByWordCount() {
        // Updated to use the simplified method
        return titleRepository.findAllByOrderByWordCountDesc();
    }

    @GetMapping("/by-agency/{agencyId}")
    public List<Title> getTitlesByAgency(@PathVariable String agencyId) {
        return titleRepository.findByAgencyId(agencyId);
    }

    @GetMapping("/by-agency/{agencyId}/by-word-count")
    public List<Title> getTitlesByAgencyOrderByWordCount(@PathVariable String agencyId) {
        return titleRepository.findByAgencyIdOrderByWordCountDesc(agencyId);
    }
}