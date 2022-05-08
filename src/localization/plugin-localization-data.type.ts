/**
 * Exports plugin localization data type.
 *
 * @module localization/plugin-localization-data.type
 */
import { PluginLocalizationRequiredKey } from './plugin-localization-required-key.enum';

/**
 * Plugin localization data type.
 */
export type PluginLocalizationData = Record<string, string> & {
  /**
   * Plugin name localization.
   */
  [PluginLocalizationRequiredKey.Name]: string;

  /**
   * Plugin description localization.
   */
  [PluginLocalizationRequiredKey.Description]: string;

  /**
   * Plugin author localization.
   */
  [PluginLocalizationRequiredKey.Author]: string;

  /**
   * Plugin help localization.
   */
  [PluginLocalizationRequiredKey.Help]: string;
};
