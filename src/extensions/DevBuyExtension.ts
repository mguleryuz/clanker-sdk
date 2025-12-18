import { type Address, encodeAbiParameters } from 'viem'
import { CLANKERS } from '../utils/clankers'
import type { IClankerExtension } from './IClankerExtension'

/**
 * Data for V4 DevBuy extension (uses V4 pool for ETH -> paired token swap)
 */
export interface DevBuyExtensionDataV4 {
  pairedTokenPoolKey: {
    currency0: Address
    currency1: Address
    fee: number
    tickSpacing: number
    hooks: Address
  }
  pairedTokenAmountOutMinimum: bigint
  recipient: Address
}

/**
 * Data for V3 DevBuy extension (uses V3 pool for ETH -> paired token swap)
 */
export interface DevBuyExtensionDataV3 {
  /** V3 pool fee tier (100, 500, 3000, 10000) */
  uniV3Fee: number
  pairedTokenAmountOutMinimum: bigint
  recipient: Address
}

/**
 * DevBuy extension using V4 pools for the ETH -> paired token swap.
 */
export class DevBuyExtension implements IClankerExtension {
  readonly address = CLANKERS.clanker_v4.related.devbuy
  readonly name = 'DevBuy'
  readonly description =
    'Performs an initial swap of the token using passed-in ETH (V4 pool routing)'
  readonly maxAllocationPercentage = 90
  readonly allowMultiple = true

  encodeExtensionData(data: DevBuyExtensionDataV4): `0x${string}` {
    if (!this.validateExtensionData(data)) {
      throw new Error('Invalid devBuy extension data')
    }

    return encodeAbiParameters(
      [
        {
          type: 'tuple',
          components: [
            { type: 'address', name: 'currency0' },
            { type: 'address', name: 'currency1' },
            { type: 'uint24', name: 'fee' },
            { type: 'int24', name: 'tickSpacing' },
            { type: 'address', name: 'hooks' },
          ],
        },
        { type: 'uint128' },
        { type: 'address' },
      ],
      [
        {
          currency0: data.pairedTokenPoolKey.currency0,
          currency1: data.pairedTokenPoolKey.currency1,
          fee: data.pairedTokenPoolKey.fee,
          tickSpacing: data.pairedTokenPoolKey.tickSpacing,
          hooks: data.pairedTokenPoolKey.hooks,
        },
        data.pairedTokenAmountOutMinimum,
        data.recipient,
      ]
    )
  }

  validateExtensionData(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false
    const devBuyData = data as DevBuyExtensionDataV4

    return (
      typeof devBuyData.pairedTokenPoolKey === 'object' &&
      devBuyData.pairedTokenPoolKey !== null &&
      typeof devBuyData.pairedTokenPoolKey.currency0 === 'string' &&
      typeof devBuyData.pairedTokenPoolKey.currency1 === 'string' &&
      typeof devBuyData.pairedTokenPoolKey.fee === 'number' &&
      typeof devBuyData.pairedTokenPoolKey.tickSpacing === 'number' &&
      typeof devBuyData.pairedTokenPoolKey.hooks === 'string' &&
      typeof devBuyData.pairedTokenAmountOutMinimum === 'bigint' &&
      typeof devBuyData.recipient === 'string'
    )
  }
}

/**
 * DevBuy extension using V3 pools for the ETH -> paired token swap.
 * Use this when your paired token has an existing V3 pool with WETH.
 */
export class DevBuyV3Extension implements IClankerExtension {
  readonly address: `0x${string}`
  readonly name = 'DevBuyV3'
  readonly description =
    'Performs an initial swap of the token using passed-in ETH (V3 pool routing for ETH -> paired token)'
  readonly maxAllocationPercentage = 90
  readonly allowMultiple = true

  constructor(devbuyV3Address: `0x${string}`) {
    this.address = devbuyV3Address
  }

  encodeExtensionData(data: DevBuyExtensionDataV3): `0x${string}` {
    if (!this.validateExtensionData(data)) {
      throw new Error('Invalid devBuyV3 extension data')
    }

    return encodeAbiParameters(
      [
        { type: 'uint24', name: 'uniV3Fee' },
        { type: 'uint128', name: 'pairedTokenAmountOutMinimum' },
        { type: 'address', name: 'recipient' },
      ],
      [data.uniV3Fee, data.pairedTokenAmountOutMinimum, data.recipient]
    )
  }

  validateExtensionData(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false
    const devBuyData = data as DevBuyExtensionDataV3

    return (
      typeof devBuyData.uniV3Fee === 'number' &&
      [100, 500, 2500, 3000, 10000].includes(devBuyData.uniV3Fee) &&
      typeof devBuyData.pairedTokenAmountOutMinimum === 'bigint' &&
      typeof devBuyData.recipient === 'string'
    )
  }
}
