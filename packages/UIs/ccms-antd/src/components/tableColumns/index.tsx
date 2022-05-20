import TextColumns from './text'
import DatetimeColumns from './datetime'
import DatetimeRangeColumns from './datetimeRange'
import NumberColumn from './number'
import NumberRangeColumn from './numberRange'
import MultirowColumn from './multirowText'
import EnumColumn from './enum'
import ImageColumn from './image'
import CustomColumn from './custom'
import OperationColumn from './operation'

export default {
  text: TextColumns,
  datetime: DatetimeColumns,
  datetimeRange: DatetimeRangeColumns,
  number: NumberColumn,
  numberRange: NumberRangeColumn,
  multirowText: MultirowColumn,
  Aenum: EnumColumn,
  image: ImageColumn,
  custom: CustomColumn,
  operation: OperationColumn
}
