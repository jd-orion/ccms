import TextField from './text'
import LongTextField from './longtext'
import DescField from './description'
import FormField from './form'
import RadioField from './radio'
import SelectSingleField from './select/single'
import SelectMultipleField from './select/multiple'
import TreeSelectField from './treeSelect'
import ImportSubformField from './importSubform'
import GroupField from './group'
import AnyField from './any'
import NumberField from './number'

export default {
  text: TextField,
  form: FormField,
  radio: RadioField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField,
  longtext: LongTextField,
  desc: DescField,
  tree_select: TreeSelectField,
  import_subform: ImportSubformField,
  group: GroupField,
  any: AnyField,
  number: NumberField
}
