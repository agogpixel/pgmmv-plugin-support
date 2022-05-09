/**
 * Exports plugin configuration API.
 *
 * @module plugin-config.interface
 */
import type {
  AgtkPluginActionCommand,
  AgtkPluginAutoTileParameters,
  AgtkPluginLinkCondition,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';

import type { PluginLocalization } from './localization';

/**
 * Plugin configuration.
 */
export interface PluginConfig {
  /**
   * Plugin localizations.
   */
  localizations: PluginLocalization[];

  /**
   * Plugin UI parameters.
   */
  parameters?: AgtkPluginUiParameter[];

  /**
   * Plugin action commands.
   */
  actionCommands?: AgtkPluginActionCommand[];

  /**
   * Plugin auto tile parameters.
   */
  autoTiles?: AgtkPluginAutoTileParameters;

  /**
   * Plugin link conditions.
   */
  linkConditions?: AgtkPluginLinkCondition[];
}
