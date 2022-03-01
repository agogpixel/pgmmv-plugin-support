import type {
  AgtkPluginActionCommand,
  AgtkPluginLinkCondition,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';

/**
 *
 */
export interface PluginLocalizationManager {
  /**
   *
   * @param key
   */
  get(key: string): string;

  /**
   *
   */
  getLocale(): string;

  /**
   *
   * @param locale
   */
  setLocale(locale: string): boolean;

  /**
   *
   * @param parameters
   */
  processParameterLocale(parameters: AgtkPluginUiParameter[]): AgtkPluginUiParameter[];

  /**
   *
   * @param executeCommands
   */
  processExecuteCommandLocale(executeCommands: AgtkPluginActionCommand[]): AgtkPluginActionCommand[];

  /**
   *
   * @param linkConditions
   */
  processLinkConditionLocale(linkConditions: AgtkPluginLinkCondition[]): AgtkPluginLinkCondition[];
}
