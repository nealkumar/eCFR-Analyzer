package com.ecfranalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Section {
    @Id
    private String id;

    private String number;
    private String heading;
    private String identifier;
    private boolean reserved;

    @ManyToOne
    @JoinColumn(name = "title_id")
    private Title title;

    @OneToMany(mappedBy = "section")
    private List<HistoricalChange> changes = new ArrayList<>();

    // Additional fields from structure data
    private String type;
    private String labelLevel;
    private String labelDescription;

    private Integer wordCount;
}