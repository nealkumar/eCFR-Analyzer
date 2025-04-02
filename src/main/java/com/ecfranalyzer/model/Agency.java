package com.ecfranalyzer.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
public class Agency {
    @Id
    private String id;
    private String name;
    private String acronym;

    @OneToMany(mappedBy = "agency")
    private List<Title> titles;
}