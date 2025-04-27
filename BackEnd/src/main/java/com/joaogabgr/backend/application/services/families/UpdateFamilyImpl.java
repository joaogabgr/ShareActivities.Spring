package com.joaogabgr.backend.application.services.families;

import com.joaogabgr.backend.core.domain.models.Families;
import com.joaogabgr.backend.core.useCase.families.UpdateFamilyUseCase;
import com.joaogabgr.backend.infra.repositories.FamiliesRepository;
import com.joaogabgr.backend.web.dto.families.UpdateFamilyDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UpdateFamilyImpl implements UpdateFamilyUseCase {
    @Autowired
    private FamiliesRepository familiesRepository;
    
    @Autowired
    private CheckUserIsAdminImpl checkUserIsAdmin;

    @Override
    public UpdateFamilyDTO execute(UpdateFamilyDTO updateFamilyDTO) throws SystemContextException {
        try {
            System.out.println(updateFamilyDTO);
            if(updateFamilyDTO.isValid()) {
                throw new SystemContextException("Dados inválidos");
            }

            // Verificar se a família existe
            Families existingFamily = familiesRepository.findById(updateFamilyDTO.getId())
                    .orElseThrow(() -> new SystemContextException("Família não encontrada"));

            // Atualizar os dados da família
            existingFamily.setName(updateFamilyDTO.getName());
            existingFamily.setDescription(updateFamilyDTO.getDescription());

            // Salvar as alterações
            familiesRepository.save(existingFamily);

            return updateFamilyDTO;
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
} 