import TextField from './text'
import GroupField from './group'
import StatementDetail from './statement'
import EnumDetailComponent from './enum'
import ImportSubformField from './importSubform'
import InfoDetail from './detailInfo'
import ImageDetail from './image'
import ColorDetail from './detailColor'
import CustomFieldComponent from './custom'
import TableFieldComponent from './table'

export default {
  text: TextField,
  group: GroupField,
  statement: StatementDetail,
  detail_enum: EnumDetailComponent,
  import_subform: ImportSubformField,
  custom: CustomFieldComponent,
  table: TableFieldComponent,
  detail_info: InfoDetail,
  detail_color: ColorDetail,
  image: ImageDetail
}
