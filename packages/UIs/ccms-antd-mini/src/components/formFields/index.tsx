import TextField from './text'
import LongTextField from './longtext'
import DescField from './description'
import FormField from './form'
import RadioField from './radio'
import SelectSingleField from './select/single'
import SelectMultipleField from './select/multiple'
import TreeSelectField from './treeSelect'

export default {
  text: TextField,
  form: FormField,
  radio: RadioField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField,
  longtext: LongTextField,
  desc: DescField,
  tree_select: TreeSelectField
}
