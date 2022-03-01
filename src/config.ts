import type {
  AgtkPluginActionCommand,
  AgtkPluginAutoTileParameters,
  AgtkPluginLinkCondition,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';

import type { PluginLocalization } from './localization';

/**
 *
 */
export interface PluginConfig {
  /**
   *
   */
  localizations: PluginLocalization[];

  /**
   *
   */
  parameters?: AgtkPluginUiParameter[];

  /**
   *
   */
  actionCommands?: AgtkPluginActionCommand[];

  /**
   *
   */
  autoTiles?: AgtkPluginAutoTileParameters;

  /**
   *
   */
  linkConditions?: AgtkPluginLinkCondition[];
}
