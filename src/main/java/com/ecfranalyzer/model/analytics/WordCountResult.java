package com.ecfranalyzer.model.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordCountResult {
    private String entityId;
    private String entityName;
    private String entityType; // AGENCY, TITLE, SECTION
    private Integer wordCount;
    private Double percentageOfTotal;
}