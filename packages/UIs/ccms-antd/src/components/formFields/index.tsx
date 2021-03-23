import TextField from './text'
import FormField from './form'
import RadioField from './radio'
import LongTextField from './longtext'
import NumberField from './number'
import DatetimeField from './datetime'
import DatetimeRangeField from './datetimeRange'
import SelectSingleField from './select/single'
import SelectMultipleField from './select/multiple'

export default {
  text: TextField,
  form: FormField,
  radio: RadioField,
  longtext: LongTextField,
  number: NumberField,
  datetime: DatetimeField,
  datetimeRange: DatetimeRangeField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField
}
