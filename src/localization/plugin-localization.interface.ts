/**
 * Exports plugin localization configuration API.
 *
 * @module localization/plugin-localization.interface
 */
import type { PluginLocalizationData } from './plugin-localization-data.type';

/**
 * Plugin localization configuration API.
 */
export interface PluginLocalization {
  /**
   * Locale.
   */
  locale: string;

  /**
   * Localization data.
   */
  data: PluginLocalizationData;
}
