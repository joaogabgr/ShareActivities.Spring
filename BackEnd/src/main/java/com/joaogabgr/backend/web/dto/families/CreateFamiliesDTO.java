package com.joaogabgr.backend.web.dto.families;

import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.web.dto.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateFamiliesDTO implements DTO {
    private String userEmail;
    private String name;

    @Override
    public Object toEntity() {
        Families families = new Families();
        families.setName(name);
        return families;
    }

    @Override
    public boolean isValid() {
        return isNotNullOrEmpty(name);
    }
}
