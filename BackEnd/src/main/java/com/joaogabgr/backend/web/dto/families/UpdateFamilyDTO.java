package com.joaogabgr.backend.web.dto.families;

import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateFamilyDTO implements DTO {
    private String id;
    private String name;
    private String description;

    @Override
    public Object toEntity() {
        Families families = new Families();
        families.setId(id);
        families.setName(name);
        families.setDescription(description);
        return families;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(id) || isNotNullOrEmpty(name);
    }
} 