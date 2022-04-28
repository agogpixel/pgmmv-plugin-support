import type {
  AgtkPluginActionCommand,
  AgtkPluginInfoCategory,
  AgtkPluginLinkCondition,
  AgtkPluginParameterValue,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types';

import type { PluginLocalizationManager } from './localization';

/**
 *
 */
export interface PluginProtectedApi<I extends JsonValue = JsonValue> {
  /**
   *
   */
  internalData: I;

  /**
   *
   */
  localization: PluginLocalizationManager;

  /**
   *
   */
  getInfoParameter(): AgtkPluginUiParameter[];

  /**
   *
   */
  getInfoInternal(): I;

  /**
   *
   */
  getInfoActionCommand(): AgtkPluginActionCommand[];

  /**
   *
   */
  getInfoLinkCondition(): AgtkPluginLinkCondition[];

  /**
   *
   */
  getInfoAutoTile(): undefined;

  /**
   *
   * @param parameters
   * @param id
   */
  getParameterValueById<T extends JsonValue = JsonValue>(
    parameters: AgtkPluginParameterValue[],
    id: number
  ): T | undefined;

  /**
   *
   */
  inEditor(): boolean;

  /**
   *
   */
  inPlayer(): boolean;

  /**
   *
   * @param directive
   * @param directiveIndex
   * @param parameters
   */
  populateParameterDefaults(
    directive:
      | AgtkPluginInfoCategory.ActionCommand
      | AgtkPluginInfoCategory.AutoTile
      | AgtkPluginInfoCategory.LinkCondition
      | AgtkPluginInfoCategory.Parameter,
    directiveIndex: number,
    target: AgtkPluginParameterValue[]
  ): AgtkPluginParameterValue[];
}
