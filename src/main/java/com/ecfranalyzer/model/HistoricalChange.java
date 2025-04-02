package com.ecfranalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricalChange {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    private String correctiveAction;
    private LocalDate errorCorrected;
    private LocalDate errorOccurred;
    private String frCitation;
    private Integer position;
    private boolean displayInToc;
    private Integer yearValue;
    private LocalDate lastModified;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "historical_change_id")
    private List<CfrReference> cfrReferences = new ArrayList<>();

    @Data
    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CfrReference {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String cfrReference;

        @Embedded
        private Hierarchy hierarchy;

        @ManyToOne
        @JoinColumn(name = "historical_change_id")
        private HistoricalChange historicalChange;
    }

    @Data
    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Hierarchy {
        private String title;
        private String subtitle;
        private String chapter;
        private String part;
        private String subpart;
        private String section;
    }
}