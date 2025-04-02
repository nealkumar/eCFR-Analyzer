package com.ecfranalyzer.model.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeFrequencyResult {
    private String entityId;
    private String entityName;
    private String entityType; // AGENCY, TITLE, SECTION
    private Integer totalChanges;
    private Map<LocalDate, Integer> changesByDate;
    private Double changesPerYear;
}