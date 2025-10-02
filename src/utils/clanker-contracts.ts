import type { Clanker_v3_1_abi } from '../abi/v3.1/Clanker'
import type { ClankerToken_v3_1_abi } from '../abi/v3.1/ClankerToken'
import type { LpLockerv2_abi } from '../abi/v3.1/LpLockerv2'
import type { Clanker_v4_abi } from '../abi/v4/Clanker'
import type { ClankerAirdrop_v4_abi } from '../abi/v4/ClankerAirdrop'
import type { ClankerAirdropv2_v4_abi } from '../abi/v4/ClankerAirdropV2'
import type { ClankerFeeLocker_abi } from '../abi/v4/ClankerFeeLocker'
import type { ClankerHook_DynamicFee_v4_abi } from '../abi/v4/ClankerHookDynamicFee'
import type { ClankerHook_StaticFee_v4_abi } from '../abi/v4/ClankerHookStaticFee'
import type { ClankerLocker_v4_abi } from '../abi/v4/ClankerLocker'
import type { ClankerToken_v4_abi } from '../abi/v4/ClankerToken'

export type ClankerToken = typeof ClankerToken_v3_1_abi | typeof ClankerToken_v4_abi

export type ClankerFactory = typeof Clanker_v3_1_abi | typeof Clanker_v4_abi

export type ClankerHooks = typeof ClankerHook_DynamicFee_v4_abi | typeof ClankerHook_StaticFee_v4_abi

export type ClankerContract =
  | typeof ClankerFeeLocker_abi
  | ClankerFactory
  | ClankerToken
  | ClankerHooks
  | typeof ClankerAirdrop_v4_abi
  | typeof ClankerAirdropv2_v4_abi
  | typeof LpLockerv2_abi
  | typeof ClankerLocker_v4_abi
