/**
 * Exports plugin factory.
 *
 * @module create-plugin.function
 */
import type {
  AgtkActionCommandPlugin,
  AgtkAutoTilePlugin,
  AgtkLinkConditionPlugin,
  AgtkPlugin,
  AgtkPluginActionCommand,
  AgtkPluginInfo,
  AgtkPluginLinkCondition,
  AgtkPluginUiParameter
} from '@agogpixel/pgmmv-ts/api/agtk/plugin';
import { AgtkPluginInfoCategory } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-info-category';
import { AgtkPluginParameterValue } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-parameter-value';
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import { createPluginLocalizationManager, PluginLocalizationRequiredKey } from './localization';
import type { PluginConfig } from './plugin-config.interface';
import type { PluginProtectedApi } from './plugin-protected-api.interface';

////////////////////////////////////////////////////////////////////////////////
// Public Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

// None.

////////////////////////////////////////////////////////////////////////////////
// Public Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Create an object instance that provides a base implementation for PGMMV
 * plugins.
 *
 * @typeParam I Plugin's internal data type (default: `JsonValue`).
 * @typeParam P Plugin's public API type (default: `AgtkPlugin`).
 * @param config Plugin configuration.
 * @param internal Provide an object to 'inherit' a reference to the plugin's
 * internal {@link PluginProtectedApi} implementation.
 * @returns An object instance that provides a base implementation for a PGMMV
 * plugin.
 * @public
 * @static
 */
export function createPlugin<
  I extends JsonValue = JsonValue,
  P extends
    | AgtkActionCommandPlugin<I>
    | AgtkAutoTilePlugin<I>
    | AgtkLinkConditionPlugin<I>
    | AgtkPlugin<I> = AgtkPlugin<I>
>(config: PluginConfig, internal?: PluginProtectedApi<I>) {
  // Public API container.
  const self = {} as P;

  // Protected API container.
  const internalApi = internal || ({} as PluginProtectedApi);

  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Plugin UI parameter configurations.
   *
   * @private
   */
  const parametersConfig = config.parameters || [];

  /**
   * Plugin action command configurations.
   *
   * @private
   */
  const actionCommandsConfig = config.actionCommands || [];

  /**
   * Plugin auto tiles configurations.
   *
   * @private
   */
  const autoTilesConfig = config.autoTiles || undefined;

  /**
   * Plugin link condition configurations.
   *
   * @private
   */
  const linkConditionsConfig = config.linkConditions || [];

  /**
   * Localized plugin UI parameters.
   *
   * @private
   */
  let localizedParameters: AgtkPluginUiParameter[];

  /**
   * Localized plugin actions commands.
   *
   * @private
   */
  let localizedActionCommands: AgtkPluginActionCommand[];

  /**
   * Localized plugin link conditions.
   *
   * @private
   */
  let localizedLinkConditions: AgtkPluginLinkCondition[];

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Protected Properties
  //////////////////////////////////////////////////////////////////////////////

  internalApi.internalData = {};
  internalApi.localization = createPluginLocalizationManager({ localizations: config.localizations });

  //////////////////////////////////////////////////////////////////////////////
  // Protected Methods
  //////////////////////////////////////////////////////////////////////////////

  internalApi.getInfoParameter = function () {
    if (!localizedParameters) {
      localizedParameters = internalApi.localization.processParameterLocale(parametersConfig);
    }

    return localizedParameters;
  };

  internalApi.getInfoInternal = function () {
    return JSON.parse(JSON.stringify(internalApi.internalData));
  };

  internalApi.getInfoActionCommand = function () {
    if (!localizedActionCommands) {
      localizedActionCommands = internalApi.localization.processActionCommandLocale(actionCommandsConfig);
    }

    return localizedActionCommands;
  };

  internalApi.getInfoLinkCondition = function () {
    if (!localizedLinkConditions) {
      localizedLinkConditions = internalApi.localization.processLinkConditionLocale(linkConditionsConfig);
    }

    return localizedLinkConditions;
  };

  internalApi.getInfoAutoTile = function () {
    return autoTilesConfig as undefined;
  };

  internalApi.inEditor = function () {
    return !Agtk || typeof Agtk.log !== 'function';
  };

  internalApi.inPlayer = function () {
    return !!Agtk && typeof Agtk.version === 'string' && /^player .+$/.test(Agtk.version);
  };

  internalApi.normalizeActionCommandParameters = function (actionCommandIndex, paramValue) {
    const vj = self.getInfo(AgtkPluginInfoCategory.ActionCommand)[actionCommandIndex];
    return normalizeParameters(paramValue, vj.parameter);
  };

  internalApi.normalizeLinkConditionParameters = function (linkConditionIndex, paramValue) {
    const vj = self.getInfo(AgtkPluginInfoCategory.LinkCondition)[linkConditionIndex];
    return normalizeParameters(paramValue, vj.parameter);
  };

  internalApi.normalizeUiParameters = function (paramValue) {
    return normalizeParameters(paramValue, self.getInfo(AgtkPluginInfoCategory.Parameter));
  };

  //////////////////////////////////////////////////////////////////////////////
  // Public Properties
  //////////////////////////////////////////////////////////////////////////////

  // None.

  //////////////////////////////////////////////////////////////////////////////
  // Public Methods
  //////////////////////////////////////////////////////////////////////////////

  self.setLocale = function (arg1) {
    internalApi.localization.setLocale(arg1);
  };

  self.getInfo = function <C extends AgtkPluginInfoCategory>(category: C) {
    let info:
      | string
      | JsonValue
      | AgtkPluginUiParameter[]
      | AgtkPluginActionCommand[]
      | AgtkPluginLinkCondition[]
      | undefined;

    switch (category) {
      case AgtkPluginInfoCategory.Name:
        info = internalApi.localization.get(PluginLocalizationRequiredKey.Name);
        break;
      case AgtkPluginInfoCategory.Description:
        info = internalApi.localization.get(PluginLocalizationRequiredKey.Description);
        break;
      case AgtkPluginInfoCategory.Author:
        info = internalApi.localization.get(PluginLocalizationRequiredKey.Author);
        break;
      case AgtkPluginInfoCategory.Help:
        info = internalApi.localization.get(PluginLocalizationRequiredKey.Help);
        break;
      case AgtkPluginInfoCategory.Parameter:
        info = internalApi.getInfoParameter();
        break;
      case AgtkPluginInfoCategory.Internal:
        info = internalApi.getInfoInternal();
        break;
      case AgtkPluginInfoCategory.ActionCommand:
        info = internalApi.getInfoActionCommand();
        break;
      case AgtkPluginInfoCategory.LinkCondition:
        info = internalApi.getInfoLinkCondition();
        break;
      case AgtkPluginInfoCategory.AutoTile:
        info = internalApi.getInfoAutoTile();
        break;
    }

    return info as AgtkPluginInfo<C, I>;
  };

  self.initialize = function (data) {
    if (data) {
      self.setInternal(data);
    }
  };

  self.finalize = function () {
    return;
  };

  self.setParamValue = function () {
    return;
  };

  self.setInternal = function (data) {
    internalApi.internalData = JSON.parse(JSON.stringify(data)) || internalApi.internalData;
  };

  self.call = function call() {
    return;
  };

  // Plugin is ready!
  return self;
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Normalize plugin UI paramters.
 *
 * @param paramValue Plugin UI parameter values.
 * @param defaults Default plugin UI parameters.
 * @returns Normalized plugin UI parameters.
 * @private
 * @static
 */
function normalizeParameters(paramValue: AgtkPluginParameterValue[], defaults: AgtkPluginUiParameter[]) {
  const normalized: Record<number, JsonValue> = {};

  for (let i = 0; i < defaults.length; i++) {
    const p = defaults[i];
    normalized[p.id] = (
      p.type === AgtkPluginUiParameterType.Json ? JSON.stringify(p.defaultValue) : p.defaultValue
    ) as JsonValue;
  }

  for (let i = 0; i < paramValue.length; ++i) {
    const p = paramValue[i];
    normalized[p.id] = p.value;
  }

  return normalized;
}
