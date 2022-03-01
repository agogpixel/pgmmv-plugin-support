import type {
  AgtkPluginActionCommand,
  AgtkPluginLinkCondition,
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
   */
  inEditor(): boolean;

  /**
   *
   */
  inPlayer(): boolean;
}
