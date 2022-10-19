
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { calcDistanceOfTwoPoint } from "../../util";

@registerModifier()
export class modifier_fabao_common extends BaseModifier {
    particleId: ParticleID
    owner: CDOTA_BaseNPC_Hero
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.particleId = ParticleManager.CreateParticle( "particles/fabao_common/fabao_common.vpcf", ParticleAttachment.ROOTBONE_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 0, this.GetParent(), ParticleAttachment.ROOTBONE_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.OVERHEAD_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.OVERHEAD_FOLLOW, null, this.GetParent().GetOrigin(), true )

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const distance = calcDistanceOfTwoPoint(this.owner.GetAbsOrigin(), this.GetParent().GetAbsOrigin())
        if(distance > 2000) {
            //@ts-ignore
            this.GetParent().SetAbsOrigin(this.owner.GetAbsOrigin() + RandomVector(200))
        }
    }

    OnRefresh(params: object): void {
        // ParticleManager.DestroyParticle(this.particleId, false)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ATTACKSPEED_PERCENTAGE]
    }

    setOwner(owner: CDOTA_BaseNPC_Hero) {
        this.owner = owner
    }

    // GetModifierModelChange(): string {
    //     print('jheeeeeeeeeeeeeeeeeeee')
    //     return 'models/items/doom/fallen_sword/fallen_sword.vmdl'
    // }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.MAGIC_IMMUNE]: true,
            [ModifierState.ATTACK_IMMUNE]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }

    GetTexture(): string {
        return 'item_fabao_embry'
    }
    

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    IsHidden(): boolean {
        return true
    }
}