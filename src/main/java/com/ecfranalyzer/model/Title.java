package com.ecfranalyzer.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Title {
    @Id
    private String id;

    private String name;
    private String titleNumber;
    private LocalDate latestAmendedOn;
    private LocalDate latestIssueDate;
    private LocalDate upToDateAsOf;
    private boolean reserved;
    private boolean processingInProgress;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "agency_id")
    private Agency agency;

    @OneToMany(mappedBy = "title")
    private List<Section> sections = new ArrayList<>();

    private Integer wordCount;
    private Integer totalChanges;
}