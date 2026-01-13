import type { SetupContext } from 'vue'
import { ElIcon } from 'element-plus'

export default function InputPrefixIcon(_props: unknown, context: SetupContext) {
  return <ElIcon size={22}>{context.slots.default?.()}</ElIcon>
}
