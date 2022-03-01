import { PluginLocalizationRequiredKey } from './required-key';

/**
 *
 */
export type PluginLocalizationData = Record<string, string> & {
  /**
   *
   */
  [PluginLocalizationRequiredKey.Name]: string;

  /**
   *
   */
  [PluginLocalizationRequiredKey.Description]: string;

  /**
   *
   */
  [PluginLocalizationRequiredKey.Author]: string;

  /**
   *
   */
  [PluginLocalizationRequiredKey.Help]: string;
};
