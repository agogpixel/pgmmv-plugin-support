/**
 * Exports plugin localization manager configuration API.
 *
 * @module localization/plugin-localization-manager-config.interface
 */
import type { PluginLocalization } from './plugin-localization.interface';

/**
 * Plugin localization manager configuration API.
 */
export interface PluginLocalizationManagerConfig {
  /**
   * Plugin localization configurations.
   */
  localizations: PluginLocalization[];
}
