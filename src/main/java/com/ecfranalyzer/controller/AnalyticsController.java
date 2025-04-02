package com.ecfranalyzer.controller;

import com.ecfranalyzer.model.analytics.ChangeFrequencyResult;
import com.ecfranalyzer.model.analytics.WordCountResult;
import com.ecfranalyzer.service.AnalyticsService;
import com.ecfranalyzer.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private SummaryService summaryService;

    @GetMapping("/word-count/by-agency")
    public List<WordCountResult> getWordCountsByAgency() {
        return analyticsService.getWordCountsByAgency();
    }

    @GetMapping("/word-count/by-title")
    public List<WordCountResult> getWordCountsByTitle() {
        return analyticsService.getWordCountsByTitle();
    }

    @GetMapping("/word-count/by-section/title/{titleId}")
    public List<WordCountResult> getWordCountsBySectionForTitle(@PathVariable String titleId) {
        return analyticsService.getWordCountsBySectionForTitle(titleId);
    }

    @GetMapping("/change-frequency/by-agency")
    public List<ChangeFrequencyResult> getChangeFrequencyByAgency() {
        return analyticsService.getChangeFrequencyByAgency();
    }

    @GetMapping("/change-frequency/by-title")
    public List<ChangeFrequencyResult> getChangeFrequencyByTitle() {
        return analyticsService.getChangeFrequencyByTitle();
    }

    @GetMapping("/summary")
    public String getSummary() {
        return summaryService.generateSummary();
    }
}