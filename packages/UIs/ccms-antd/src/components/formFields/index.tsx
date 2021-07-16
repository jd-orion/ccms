import TextField from './text'
import FormField from './form'
import RadioField from './radio'
import ColorField from './color'
import UploadField from './upload'
import LongTextField from './longtext'
import NumberField from './number'
import DatetimeField from './datetime'
import DatetimeRangeField from './datetimeRange'
import SelectSingleField from './select/single'
import SelectMultipleField from './select/multiple'
import DescField from './description'
import ImageUrlField from './imageurl'

export default {
  text: TextField,
  form: FormField,
  radio: RadioField,
  longtext: LongTextField,
  number: NumberField,
  datetime: DatetimeField,
  datetimeRange: DatetimeRangeField,
  select_single: SelectSingleField,
  select_multiple: SelectMultipleField,
  desc: DescField,
  color: ColorField,
  upload: UploadField,
  imageurl: ImageUrlField
}
