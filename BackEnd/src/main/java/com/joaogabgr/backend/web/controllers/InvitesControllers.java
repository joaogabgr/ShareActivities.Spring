package com.joaogabgr.backend.web.controllers;

import com.joaogabgr.backend.application.services.invites.*;
import com.joaogabgr.backend.web.dto.families.InviteMemberToFamilyDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invites")
public class InvitesControllers {

    @Autowired
    private AcceptInviteMemberImpl acceptInviteMemberImpl;
    @Autowired
    private DeleteInviteImpl deleteInviteImpl;
    @Autowired
    private InviteMemberToFamilyimpl inviteMemberToFamilyimpl;
    @Autowired
    private ListInviteUserImpl listInviteUserImpl;
    @Autowired
    private ListInviteFamilyImpl listInviteFamilyImpl;

    @PostMapping("/acceptInviteMember/{inviteId}")
    public ResponseEntity<ResponseModelDTO> acceptInviteMember(@PathVariable String inviteId) throws SystemContextException {
        try {
            System.out.println(inviteId);
            acceptInviteMemberImpl.execute(inviteId);
            return ResponseEntity.ok(new ResponseModelDTO(true));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    @DeleteMapping("/deleteInvite/{inviteID}")
    public ResponseEntity<ResponseModelDTO> deleteInvite(@PathVariable String inviteID) throws SystemContextException {
        try {
            deleteInviteImpl.execute(inviteID);
            return ResponseEntity.ok(new ResponseModelDTO("Invite deleted"));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    @PostMapping("/inviteMemberToFamily")
    public ResponseEntity<ResponseModelDTO> inviteMemberToFamily(@RequestBody InviteMemberToFamilyDTO inviteMemberToFamilyDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(inviteMemberToFamilyimpl.execute(inviteMemberToFamilyDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    @GetMapping("/getInvites/{userEmail}")
    public ResponseEntity<ResponseModelDTO> getInvites(@PathVariable String userEmail) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(listInviteUserImpl.execute(userEmail)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }

    @GetMapping("/getInvitesFamily/{familyId}")
    public ResponseEntity<ResponseModelDTO> getInvitesFamily(@PathVariable String familyId) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(listInviteFamilyImpl.execute(familyId)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
