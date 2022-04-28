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
import { AgtkPluginInfoCategory, AgtkPluginParameterValue } from '@agogpixel/pgmmv-ts/api/agtk/plugin';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types';

import type { PluginConfig } from './config';
import { createPluginLocalizationManager, PluginLocalizationRequiredKey } from './localization';
import type { PluginProtectedApi } from './protected-api';

/**
 *
 * @param config
 * @param internal
 * @returns
 */
export function createPlugin<
  I extends JsonValue = JsonValue,
  P extends
    | AgtkActionCommandPlugin<I>
    | AgtkAutoTilePlugin<I>
    | AgtkLinkConditionPlugin<I>
    | AgtkPlugin<I> = AgtkPlugin<I>
>(config: PluginConfig, internal?: PluginProtectedApi<I>) {
  /**
   *
   */
  const self = {} as P;

  /**
   *
   */
  const internalApi = internal || ({} as PluginProtectedApi);

  /**
   *
   */
  const parametersConfig = config.parameters || [];

  /**
   *
   */
  const actionCommandsConfig = config.actionCommands || [];

  /**
   *
   */
  const autoTilesConfig = config.autoTiles || undefined;

  /**
   *
   */
  const linkConditionsConfig = config.linkConditions || [];

  /**
   *
   */
  let localizedParameters: AgtkPluginUiParameter[];

  /**
   *
   */
  let localizedActionCommands: AgtkPluginActionCommand[];

  /**
   *
   */
  let localizedLinkConditions: AgtkPluginLinkCondition[];

  /**
   *
   */
  internalApi.internalData = {};

  /**
   *
   */
  internalApi.localization = createPluginLocalizationManager({ localizations: config.localizations });

  /**
   *
   * @returns
   */
  internalApi.getInfoParameter = function getInfoParameter() {
    if (!localizedParameters) {
      localizedParameters = internalApi.localization.processParameterLocale(parametersConfig);
    }

    return localizedParameters;
  };

  /**
   *
   * @returns
   */
  internalApi.getInfoInternal = function getInfoInternal() {
    return JSON.parse(JSON.stringify(internalApi.internalData));
  };

  /**
   *
   * @returns
   */
  internalApi.getInfoActionCommand = function getInfoActionCommand() {
    if (!localizedActionCommands) {
      localizedActionCommands = internalApi.localization.processExecuteCommandLocale(actionCommandsConfig);
    }

    return localizedActionCommands;
  };

  /**
   *
   * @returns
   */
  internalApi.getInfoLinkCondition = function getInfoLinkCondition() {
    if (!localizedLinkConditions) {
      localizedLinkConditions = internalApi.localization.processLinkConditionLocale(linkConditionsConfig);
    }

    return localizedLinkConditions;
  };

  /**
   *
   * @returns
   */
  internalApi.getInfoAutoTile = function getInfoAutoTile() {
    return autoTilesConfig as undefined;
  };

  /**
   *
   * @param parameters
   * @param id
   * @returns
   */
  internalApi.getParameterValueById = function getParameterValueById<T extends JsonValue = JsonValue>(
    parameters: AgtkPluginParameterValue[],
    id: number
  ) {
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i].id === id) {
        return parameters[i].value as T;
      }
    }
  };

  /**
   *
   * @returns
   */
  internalApi.inEditor = function inEditor() {
    return !Agtk || typeof Agtk.log !== 'function';
  };

  /**
   *
   * @returns
   */
  internalApi.inPlayer = function inPlayer() {
    return !!Agtk && typeof Agtk.version === 'string' && /^player .+$/.test(Agtk.version);
  };

  /**
   *
   * @param directive
   * @param directiveIndex
   * @param target
   * @returns
   */
  internalApi.populateParameterDefaults = function populateParameterDefaults(directive, directiveIndex, target) {
    const vj = (self.getInfo(directive) as { parameter: AgtkPluginUiParameter[] }[])[directiveIndex];
    const parameter = vj.parameter;

    if (!!parameter) {
      for (let i = 0; i < parameter.length; i++) {
        const id = parameter[i].id;
        let found = false;

        for (let j = 0; j < target.length; j++) {
          if (target[j].id == id) {
            found = true;
            break;
          }
        }

        if (!found) {
          target.push({ id: id, value: parameter[i].defaultValue as JsonValue });
        }
      }
    }

    return target;
  };

  /**
   *
   * @param arg1
   */
  self.setLocale = function setLocale(arg1) {
    internalApi.localization.setLocale(arg1);
  };

  /**
   *
   * @param category
   * @returns
   */
  self.getInfo = function getInfo<C extends AgtkPluginInfoCategory>(category: C) {
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

  /**
   *
   * @param data
   */
  self.initialize = function initialize(data) {
    if (data) {
      self.setInternal(data);
    }
  };

  /**
   *
   * @returns
   */
  self.finalize = function finalize() {
    return;
  };

  /**
   *
   * @returns
   */
  self.setParamValue = function setParamValue() {
    return;
  };

  /**
   *
   * @param data
   */
  self.setInternal = function setInternal(data) {
    internalApi.internalData = JSON.parse(JSON.stringify(data)) || internalApi.internalData;
  };

  /**
   *
   * @returns
   */
  self.call = function call() {
    return;
  };

  return self;
}
