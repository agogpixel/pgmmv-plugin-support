/**
 * Exports plugin localization manager API.
 *
 * @module localization/plugin-localization-manager.interface
 */
import type {
  AgtkPluginActionCommand,
  AgtkPluginLinkCondition,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';

/**
 * Plugin localization manager API.
 */
export interface PluginLocalizationManager {
  /**
   * Get localization for specified key.
   *
   * @param key Localization key.
   * @returns Resolved localization or fallback.
   * @public
   */
  get(key: string): string;

  /**
   * Get current locale.
   *
   * @returns Current locale.
   * @public
   */
  getLocale(): string;

  /**
   * Set current locale.
   *
   * @param locale Locale to be set.
   * @returns `true` when successful, `false` otherwise.
   * @public
   */
  setLocale(locale: string): boolean;

  /**
   * Process plugin UI parameter inline localization text functions.
   *
   * @param parameters Plugin UI parameters.
   * @returns Localized plugin UI parameters.
   * @public
   */
  processParameterLocale(parameters: AgtkPluginUiParameter[]): AgtkPluginUiParameter[];

  /**
   * Process plugin action command inline localization text functions.
   *
   * @param executeCommands Plugin action commands.
   * @returns Localized plugin action commands.
   * @public
   */
  processExecuteCommandLocale(executeCommands: AgtkPluginActionCommand[]): AgtkPluginActionCommand[];

  /**
   * Process plugin link condition inline localization text functions.
   *
   * @param linkConditions Plugin link conditions.
   * @returns Localized plugin link conditions.
   * @public
   */
  processLinkConditionLocale(linkConditions: AgtkPluginLinkCondition[]): AgtkPluginLinkCondition[];
}
