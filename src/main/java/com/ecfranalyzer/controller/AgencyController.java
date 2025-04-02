package com.ecfranalyzer.controller;

import com.ecfranalyzer.model.Agency;
import com.ecfranalyzer.model.Title;
import com.ecfranalyzer.repository.AgencyRepository;
import com.ecfranalyzer.repository.TitleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agencies")
public class AgencyController {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private TitleRepository titleRepository;

    @GetMapping
    public List<Agency> getAllAgencies() {
        return agencyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agency> getAgencyById(@PathVariable String id) {
        Optional<Agency> agency = agencyRepository.findById(id);
        return agency.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Agency> searchAgencies(@RequestParam String name) {
        return agencyRepository.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}/titles")
    public List<Title> getTitlesByAgency(@PathVariable String id) {
        return titleRepository.findByAgencyId(id);
    }

    @GetMapping("/by-title-count")
    public List<Agency> getAgenciesByTitleCount() {
        return agencyRepository.findAllOrderByTitleCountDesc();
    }
}