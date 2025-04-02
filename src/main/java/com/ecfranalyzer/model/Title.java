package com.ecfranalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne
    @JoinColumn(name = "agency_id")
    private Agency agency;

    @OneToMany(mappedBy = "title")
    private List<Section> sections;

    private Integer wordCount;
    private Integer totalChanges;
}