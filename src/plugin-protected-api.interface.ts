/**
 * Exports plugin protected API.
 *
 * @module plugin-protected-api.interface
 */
import type {
  AgtkPluginActionCommand,
  AgtkPluginLinkCondition,
  AgtkPluginParameterValue,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { PluginLocalizationManager } from './localization';

/**
 * Plugin protected API. Provides helper methods and an interface that
 * derived plugins can extend. Facilitates object inheritence.
 *
 * @typeParam I Internal data type (default: `JsonValue`).
 */
export interface PluginProtectedApi<I extends JsonValue = JsonValue> {
  /**
   * Reference to the plugin's internal data.
   *
   * @protected
   */
  internalData: I;

  /**
   * Reference to the plugin's localization manager.
   *
   * @protected
   */
  localization: PluginLocalizationManager;

  /**
   * Get the plugin's UI parameters. Called by {@link AgtkPlugin.getInfo}.
   *
   * @returns Plugin UI parameters.
   * @protected
   */
  getInfoParameter(): AgtkPluginUiParameter[];

  /**
   * Get a copy of the plugin's internal data. Called by
   * {@link AgtkPlugin.getInfo}.
   *
   * @returns Copy of internal data.
   * @protected
   */
  getInfoInternal(): I;

  /**
   * Get the plugin's action command configurations. Called by
   * {@link AgtkPlugin.getInfo}.
   *
   * @returns Plugin action command configuration data.
   * @protected
   */
  getInfoActionCommand(): AgtkPluginActionCommand[];

  /**
   * Get the plugin's link condition configurations. Called by
   * {@link AgtkPlugin.getInfo}.
   *
   * @returns Plugin link condition configuration data.
   * @protected
   */
  getInfoLinkCondition(): AgtkPluginLinkCondition[];

  /**
   * Get the plugin's auto tile configurations. Called by
   * {@link AgtkPlugin.getInfo}.
   *
   * TODO: Doesn't do anything...
   *
   * @returns Plugin link condition configuration data.
   * @protected
   * @todo
   */
  getInfoAutoTile(): undefined;

  /**
   * Test if plugin is executing within the PGMMV editor environment.
   *
   * @returns `true` when in PGMMV editor, `false` otherwise.
   * @protected
   */
  inEditor(): boolean;

  /**
   * Test if plugin is executing within the PGMMV runtime environment.
   *
   * @returns `true` when in PGMMV runtime, `false` otherwise.
   * @protected
   */
  inPlayer(): boolean;

  /**
   * Helper method for normalizing plugin action command UI parameters provided
   * by PGMMV editor or runtime. Maps parameter ID to parameter value; unset
   * values will fallback to default value specified in the plugin's action
   * command UI parameter configuration.
   *
   * @param actionCommandIndex Action command index.
   * @param paramValue Plugin action command UI parameter values.
   * @returns Normalized plugin action command UI parameters.
   * @protected
   */
  normalizeActionCommandParameters(
    actionCommandIndex: number,
    paramValue: AgtkPluginParameterValue[]
  ): Record<number, JsonValue>;

  /**
   * Helper method for normalizing plugin link condition UI parameters provided
   * by PGMMV editor or runtime. Maps parameter ID to parameter value; unset
   * values will fallback to default value specified in the plugin's link
   * condition UI parameter configuration.
   *
   * @param linkConditionIndex Link condition index.
   * @param paramValue Plugin link condition UI parameter values.
   * @returns Normalized plugin link condition UI parameters.
   * @protected
   */
  normalizeLinkConditionParameters(
    linkConditionIndex: number,
    paramValue: AgtkPluginParameterValue[]
  ): Record<number, JsonValue>;

  /**
   * Helper method for normalizing plugin UI parameters provided by PGMMV editor
   * or runtime. Maps parameter ID to parameter value; unset values will
   * fallback to default value specified in the plugin's UI parameter
   * configuration.
   *
   * @param paramValue Plugin UI parameter values.
   * @returns Normalized plugin UI parameters.
   * @protected
   */
  normalizeUiParameters(paramValue: AgtkPluginParameterValue[]): Record<number, JsonValue>;
}
