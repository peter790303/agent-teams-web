import type { Model } from '../Model'

export function assembleModel(input: Model): Model {
  return { ...input, capabilities: [...input.capabilities] }
}
